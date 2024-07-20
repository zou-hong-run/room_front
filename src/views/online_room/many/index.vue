<script setup lang="ts">
import { onMounted, ref } from 'vue';
import {
  getLocalMediaStream,
  setLocalVideoStream,
  getLocalScreenMediaStream,
  createPeerConnection,
  createVideoEleUseByMany,
  setRemoteVideoStream,
} from '@/utils/common';
// @ts-ignore
import { io } from '@/utils/socket.io.esm.min.js';

const roomId = ref('多人会议房间1');
const userId = ref('参会人员1');

const offerVideoRef = ref(null);

const localStream = ref();

const peerMap = ref<Map<string, RTCPeerConnection>>(new Map());
let roomUserIdList = ref([]);
let connectingUserIdList = ref([]);

let isStopAudio = ref(false);
let isStopVideo = ref(false);
let client = ref();
let isInit = ref(false);

const onHandleStart = () => {
  const serverUrl = 'wss://192.168.0.107:3333';
  const options = {
    reconnectDelayMat: 10000,
    transports: ['websocket'],
    query: {
      roomId: roomId.value,
      userId: userId.value,
    },
  };
  if (!client.value) {
    client.value = new io(serverUrl, options);
  }
  client.value.on('connect', () => {
    console.log('Connection successful!');
  });
  client.value.on('disconnect', () => {
    console.log('Connection disconnect!');
  });
  client.value.on('error', () => {
    console.log('Connection error!');
  });
  client.value.on('room-msg', (data: any) => {
    console.log(data);
  });
  client.value.on('user-id-list-msg', async (userIdList: any) => {
    roomUserIdList.value = userIdList;
    connectingUserIdList.value = roomUserIdList.value.filter(
      (item: any) => item !== userId.value,
    );
    for (let id of connectingUserIdList.value) {
      let peer = peerMap.value.get(id);
      if (!peer) {
        peer = createPeerConnection();
        peer.createDataChannel('data-channel');
        peerMap.value.set(id, peer);
        /**
         * @param {RTCPeerConnectionIceEvent} event
         */
        peer.onicecandidate = (event: any) => {
          console.log('candidate');
          if (event.candidate) {
            client.value.emit('candidate-msg', {
              fromUserId: userId.value,
              toUserId: id,
              candidate: event.candidate,
            });
          }
        };
        /**
         * @param {RTCTrackEvent} event
         */
        peer.ontrack = (event: any) => {
          console.log('ontrack');
          let videoEle = createVideoEleUseByMany(id);
          setRemoteVideoStream(videoEle, event.track);
        };
        peer.ondatachannel = (_e: any) => {
          console.log('DataChannel is created');
          // console.log("ondatachannel", e);
        };
        localStream.value.getTracks().forEach((track: any) => {
          peer?.addTrack(track, localStream.value);
        });
        if (!isInit.value) {
          let offerSDP = await peer.createOffer();
          await peer.setLocalDescription(offerSDP);
          client.value.emit('offer-sdp-msg', {
            fromUserId: userId.value,
            toUserId: id,
            sdp: offerSDP,
          });
        }
      }
    }
    isInit.value = true;
  });
  client.value.on(
    'offer-sdp-msg',
    async (data: { fromUserId: any; toUserId: any; sdp: any }) => {
      let { fromUserId, toUserId, sdp } = data;
      if (userId.value === toUserId) {
        console.log(connectingUserIdList, fromUserId, 'offer');
        /**
         * @type {RTCPeerConnection}
         */
        let peer = peerMap.value.get(fromUserId);
        if (peer) {
          await peer.setRemoteDescription(sdp);
          let answerSDP = await peer.createAnswer();
          await peer.setLocalDescription(answerSDP);
          client.value.emit('answer-sdp-msg', {
            fromUserId: toUserId,
            toUserId: fromUserId,
            sdp: answerSDP,
          });
        }
      }
    },
  );
  client.value.on(
    'answer-sdp-msg',
    async (data: { fromUserId: any; toUserId: any; sdp: any }) => {
      let { fromUserId, toUserId, sdp } = data;
      if (userId.value === toUserId) {
        console.log(connectingUserIdList, fromUserId, 'answer');
        /**
         * @type {RTCPeerConnection}
         */
        let peer = peerMap.value.get(fromUserId);
        if (peer) {
          await peer.setRemoteDescription(sdp);
        }
      }
    },
  );
  // 交换candiate信息
  client.value.on(
    'candidate-msg',
    async (data: { fromUserId: any; toUserId: any; candidate: any }) => {
      let { fromUserId, toUserId, candidate } = data;
      if (userId.value === toUserId) {
        // console.log(connectingUserIdList, fromUserId, "candidate");
        /**
         * @type {RTCPeerConnection}
         */
        let peer = peerMap.value.get(fromUserId);
        if (peer) {
          await peer.addIceCandidate(candidate);
        }
      }
    },
  );
  client.value.on('client-leave', (data: any) => {
    console.log(data);
  });
};
const onHandleStop = () => {
  isStopAudio.value = !isStopAudio.value;
  isStopVideo.value = !isStopVideo.value;
  for (let id of connectingUserIdList.value) {
    let peer = peerMap.value.get(id);
    if (peer) {
      peer!
        .getSenders()
        .find((sender) => sender.track!.kind === 'audio')!.track!.enabled =
        !isStopAudio.value;
      peer!
        .getSenders()
        .find((sender) => sender.track!.kind === 'video')!.track!.enabled =
        !isStopVideo.value;
    }
  }
};
const onHandleVideo = async () => {
  let newStream = await getLocalMediaStream({
    video: true,
    audio: true,
  });
  if (newStream) {
    localStream.value = newStream;
    setLocalVideoStream(offerVideoRef.value!, localStream.value);
    localStream.value.getVideoTracks().forEach((track: any) => {
      for (let id of connectingUserIdList.value) {
        let peer = peerMap.value.get(id);
        if (peer) {
          peer
            .getSenders()!
            .find((sender) => sender!.track!.kind === 'video')!
            .replaceTrack(track);
        }
      }
    });
  }
};
const onHandleScreen = async () => {
  let newStream = await getLocalScreenMediaStream({
    // video: {
    //   cursor: 'always' | 'motion' | 'never',
    //   displaySurface: 'application' | 'browser' | 'monitor' | 'window'
    // }
  });
  if (newStream) {
    localStream.value = newStream;
    setLocalVideoStream(offerVideoRef.value!, localStream.value);
    localStream.value
      .getVideoTracks()
      .forEach((track: MediaStreamTrack | null) => {
        for (let id of connectingUserIdList.value) {
          let peer = peerMap.value.get(id);
          if (peer) {
            peer
              .getSenders()
              .find((sender) => sender.track!.kind === 'video')!
              .replaceTrack(track);
          }
        }
      });
  }
};
onMounted(async () => {
  localStream.value = await getLocalMediaStream({ video: true, audio: true });
  setLocalVideoStream(offerVideoRef.value!, localStream.value!);
});
</script>

<template>
  <div class="meeting-room-many">
    <el-container class="container">
      <el-aside class="aside">
        <el-card class="card">
          <template #header>
            <div class="card-header">
              <span class="title">多人线上会议室</span>
            </div>
          </template>
          <el-form label-position="top">
            <el-form-item label-width="90px" label="会议室房间号：">
              <el-input placeholder="请输入房间号" v-model="roomId" />
            </el-form-item>
            <el-form-item label-width="90px" label="临时会话昵称：">
              <el-input placeholder="请输入临时会话昵称" v-model="userId" />
            </el-form-item>
          </el-form>

          <el-divider />
          <div class="btns">
            <el-button
              style="width: 100px"
              type="success"
              plain
              class="startBtn"
              @click="onHandleStart"
              >开始通话</el-button
            >
            <el-button
              style="width: 100px"
              type="success"
              plain
              class="stopBtn"
              @click="onHandleStop"
              >暂停/恢复通话</el-button
            >
            <el-button
              style="width: 100px"
              type="success"
              plain
              class="videoBtn"
              @click="onHandleVideo"
              >视频通话</el-button
            >
            <el-button
              style="width: 100px"
              type="success"
              plain
              class="screenBtn"
              @click="onHandleScreen"
              >屏幕共享</el-button
            >
          </div>

          <template #footer>
            💓！你好
            <el-divider />
            💓！ 共同加入一个通话房间即可通话
            <el-divider />
            💓！ 该页面可提供保证安全稳定的多对多通话房间
          </template>
        </el-card>
      </el-aside>
      <el-main class="main">
        <div class="video-container">
          <video
            poster="../../../assets/icons/vite.svg"
            autoplay
            muted
            ref="offerVideoRef"
            id="offerVideo"
          ></video>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped lang="scss">
.title {
  font-size: 30px;
  -webkit-text-fill-color: transparent;
  background: linear-gradient(120deg, #bd34fe 30%, #41d1ff);
  background-clip: text;
}
.meeting-room-many {
  width: 100%;
  height: 100%;
  .container {
    width: 100%;
    height: 100%;
    .aside {
      width: 30%;
      height: 100%;
      display: flex;
      .card {
        color: #409eff;
        .btns {
          ::v-deep(.el-button + .el-button) {
            margin-left: 0 !important;
          }
          display: flex;
          flex-wrap: wrap;
          justify-content: space-around;
          align-content: space-around;
        }
      }
    }
    .main {
      width: 70%;
      border-radius: 5px;
      border: 1px solid #409eff;

      .video-container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        align-items: space-around;
        align-content: space-around;
        video,
        .video {
          width: 40%;
          height: 40%;
          border: 1px solid pink;
          border-radius: 15px;
        }
      }
    }
  }
  .card-header {
    text-align: center;
  }
}
</style>
