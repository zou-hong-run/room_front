<script setup lang="ts">
import { onMounted, ref } from 'vue';
import {
  getLocalMediaStream,
  setLocalVideoStream,
  getLocalScreenMediaStream,
  createPeerConnection,
  createVideoEle,
  setRemoteVideoStream,
} from '@/utils/common';
// @ts-ignore
import { io } from '@/utils/socket.io.esm.min.js';
const roomId = ref('房间1');
const userId = ref('匿名用户1');
const offerVideoRef = ref(null);
const localStream = ref();
let isStopAudio = ref(false);
let isStopVideo = ref(false);
let isInited = ref(false);
let isRoomFull = ref(false);
let peer = ref<RTCPeerConnection | null>(null);
let client = ref();
const serverUrl = 'wss://192.168.0.107:3333';
const onHandleStop = () => {
  if (peer.value) {
    isStopAudio.value = !isStopAudio.value;
    isStopVideo.value = !isStopVideo.value;
    console.log(isStopAudio.value);
    peer.value
      .getSenders()
      .find((sender) => sender.track!.kind === 'audio')!.track!.enabled =
      !isStopAudio.value;
    peer.value
      .getSenders()
      .find((sender) => sender.track!.kind === 'video')!.track!.enabled =
      !isStopVideo.value;
  }
};
const onHandleStart = () => {
  if (isRoomFull.value) {
    alert('当前房间人数已满');
    return;
  }
  if (!client.value) {
    client.value = new io(serverUrl, {
      reconnectDelayMat: 10000,
      transports: ['websocket'],
      query: {
        roomId: roomId.value,
        userId: userId.value,
      },
    });
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
  client.value.on('people-count-msg', async (count: number) => {
    if (count === 1) {
      isInited.value = true;
    }
    peer.value = createPeerConnection();
    localStream.value.getTracks().forEach((track: any) => {
      peer.value?.addTrack(track, localStream.value);
    });
    /**
     * @param {RTCPeerConnectionIceEvent} event
     */
    peer.value.onicecandidate = (event: { candidate: any }) => {
      // console.log("candidate", event.candidate);
      if (event.candidate) {
        client.value.emit('candidate-msg', event.candidate);
      }
    };
    /**
     * @param {RTCTrackEvent} event
     */
    peer.value.ontrack = (event: { track: any }) => {
      let videoEle = createVideoEle(count);
      setRemoteVideoStream(videoEle, event.track);
    };
    if (!isInited.value) {
      let offerSDP = await peer.value.createOffer();
      await peer.value.setLocalDescription(offerSDP);
      client.value.emit('offer-sdp-msg', offerSDP);
    }
    isInited.value = true;
  });
  client.value.on('room-full', () => {
    alert('当房间人数已经满了');
    isRoomFull.value = true;
    return;
  });
  // A收到B的sdp
  client.value.on('offer-sdp-msg', async (offerSDP: any) => {
    if (peer.value) {
      await peer.value.setRemoteDescription(offerSDP);
      let answerSDP = await peer.value.createAnswer();
      await peer.value.setLocalDescription(answerSDP);
      client.value.emit('answer-sdp-msg', answerSDP);
    }
  });
  // B收到A的sdp
  client.value.on('answer-sdp-msg', async (answerSDP: any) => {
    await peer.value?.setRemoteDescription(answerSDP);
  });
  // 交换candiate信息
  client.value.on('candidate-msg', async (candidate: any) => {
    await peer.value?.addIceCandidate(candidate);
  });
  client.value.on('client-leave', (data: any) => {
    console.log(data);
  });
};
const onHandleVideo = async () => {
  let newStream = await getLocalMediaStream({ video: true, audio: true });
  if (newStream) {
    localStream.value = newStream;
    setLocalVideoStream(offerVideoRef.value!, localStream.value);
    localStream.value
      .getVideoTracks()
      .forEach((track: MediaStreamTrack | null) => {
        peer.value
          ?.getSenders()
          .find((sender) => sender.track!.kind === 'video')!
          .replaceTrack(track);
      });
  }
};
const onHandleScreen = async () => {
  let newStream = await getLocalScreenMediaStream({
    video: {
      // cursor: 'always',
      // displaySurface: 'application' | 'browser' | 'monitor' | 'window',
    },
  });
  if (newStream) {
    localStream.value = newStream;
    setLocalVideoStream(offerVideoRef.value!, localStream.value);
    localStream.value.getVideoTracks().forEach((track: any) => {
      peer.value
        ?.getSenders()
        .find((sender) => sender.track!.kind === 'video')!
        .replaceTrack(track);
    });
  }
};
onMounted(async () => {
  localStream.value = await getLocalMediaStream({ video: true, audio: true });
  setLocalVideoStream(offerVideoRef.value!, localStream.value!);
});
</script>

<template>
  <div class="meeting-room-one">
    <el-container class="container">
      <el-aside class="aside">
        <el-card class="card">
          <template #header>
            <div class="card-header">
              <span class="title">一对一会议室房间</span>
            </div>
          </template>
          <el-form label-position="top">
            <el-form-item label-width="90px" label="房间号：">
              <el-input placeholder="请输入会议号" v-model="roomId" />
            </el-form-item>
            <el-form-item label-width="90px" label="临时会话昵称：">
              <el-input placeholder="请输入临时会话昵称" v-model="userId" />
            </el-form-item>
          </el-form>

          <el-divider />
          <div class="btns">
            <el-button
              style="width: 100px"
              type="primary"
              plain
              class="startBtn"
              @click="onHandleStart"
              >开始通话</el-button
            >
            <el-button
              style="width: 100px"
              type="primary"
              plain
              class="stopBtn"
              @click="onHandleStop"
              >暂停/恢复通话</el-button
            >
            <el-button
              style="width: 100px"
              type="primary"
              plain
              class="videoBtn"
              @click="onHandleVideo"
              >视频通话</el-button
            >
            <el-button
              style="width: 100px"
              type="primary"
              plain
              class="screenBtn"
              @click="onHandleScreen"
              >屏幕共享</el-button
            >
          </div>

          <template #footer>
            (*￣︶￣)！你好
            <el-divider />
            (*￣︶￣)！ 共同加入一个通话房间即可通话
            <el-divider />
            (*￣︶￣)！ 该页面可提供保证安全的一对一通话
            <el-divider />
            (*￣︶￣)！ 没有其他人能够打扰
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
.meeting-room-one {
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
        align-items: center;
        // .use-default-poster {
        //   background: white;
        // }
        // video::-webkit-media-controls {
        //   background-color: white;
        // }
        // video::-webkit-media-controls-enclosure {
        //   background-color: white;
        // }
        // video::-webkit-media-controls-panel {
        //   background-color: white;
        // }
        // video::-webkit-media-controls-current-time-display {
        //   color: white;
        // }
        // video::-webkit-media-controls-timeline {
        //   background-color: white;
        // }
        // video::-webkit-media-controls-volume-slider {
        //   background-color: white;
        // }
        // video::-webkit-media-controls:not(.audio-only)
        //   div[pseudo='-webkit-media-controls-panel' i] {
        //   background: white;
        // }
        video,
        .video {
          width: 70%;
          height: 70%;
          border: 1px solid pink;
          border-radius: 15px;
        }
        #offerVideo {
          align-self: flex-start;
          width: 30%;
          height: 30%;
        }
      }
    }
  }
  .card-header {
    text-align: center;
  }
}
</style>
