/**
 * 检测是否完整的url路径
 * @param path
 * @returns
 */
export const isUrl = (path: string): boolean => {
  // return url.indexOf('http://') !== -1 || url.indexOf('https://') !== -1
  const reg =
    /(((^https?:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
  return reg.test(path);
};
/**
 * const path = "https://example.com//path//to//resource";
const result = uniqueSlash(path);
console.log(result); // 输出： https://example.com/path/to/resource
 * 将路径中重复的正斜杆替换成单个斜杆隔开的字符串
 */
export const uniqueSlash = (path: string) =>
  path.replace(/(https?:\/)|(\/)+/g, '$1$2');

/**
 * 获取本地媒体数据流
 * @param {MediaStreamConstraints} constraints
 */
export const getLocalMediaStream = async (
  constraints: MediaStreamConstraints,
) => {
  try {
    let stream = await navigator.mediaDevices.getUserMedia(constraints);
    return stream;
  } catch (error) {
    console.log('error', error);
  }
};
/**
 * 获取本地共享屏幕数据流
 * @param {MediaStreamConstraints} constraints
 */
export const getLocalScreenMediaStream = async (
  constraints: MediaStreamConstraints,
) => {
  try {
    let stream = await navigator.mediaDevices.getDisplayMedia(constraints);
    return stream;
  } catch (error) {
    console.log('error', error);
  }
};
/**
 *
 * @param {HTMLVideoElement} ele
 * @param {MediaProvider } newStream
 */
export const setLocalVideoStream = (
  ele: HTMLVideoElement,
  newStream: MediaProvider,
) => {
  if (ele) {
    let stream = ele.srcObject as MediaStream;
    if (stream) {
      stream.getAudioTracks().forEach((e) => {
        stream.removeTrack(e);
      });
      stream.getVideoTracks().forEach((e) => {
        stream.removeTrack(e);
      });
    }
    ele.srcObject = newStream;
  }
};
/**
 *
 * @param {HTMLVideoElement} ele
 * @param {*} track
 */
export const setRemoteVideoStream = (ele: HTMLVideoElement, track: any) => {
  if (ele) {
    let stream = ele.srcObject as MediaStream;
    if (stream) {
      stream.addTrack(track);
    } else {
      let newStream = new MediaStream();
      newStream.addTrack(track);
      ele.srcObject = newStream;
      ele.muted = true;
    }
  }
};

export const createPeerConnection = () => {
  const peer = new RTCPeerConnection({
    bundlePolicy: 'max-bundle',
    rtcpMuxPolicy: 'require',
    // iceTransportPolicy: 'relay',// 强制服务器转发
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  });
  return peer;
};
/**
 *
 * @param {number} count
 * @returns
 */
export const createVideoEle = (count: number) => {
  let video_container = document.querySelector('.video-container')!;
  /**
   * @type {HTMLVideoElement}
   */
  let video: HTMLVideoElement = document.querySelector('#video' + count)!;
  if (!video) {
    video = document.createElement('video');
    video.muted = true;
    video.autoplay = true;
    video.controls = false;
    video.style.cssText += `width: 70%;
    height: 70%;
    border: 1px solid pink;
    border-radius: 15px;`;
    video.id = 'video' + count;
    video_container.appendChild(video);
  }
  return video;
};
/**
 *
 * @param {number} count
 * @returns
 */
export const createVideoEleUseByMany = (count: number) => {
  let video_container = document.querySelector('.video-container')!;
  /**
   * @type {HTMLVideoElement}
   */
  let video: HTMLVideoElement = document.querySelector('#video' + count)!;
  if (!video) {
    video = document.createElement('video');
    video.muted = true;
    video.autoplay = true;
    video.controls = false;
    video.style.cssText += `width: 40%;
    height: 40%;
    border: 1px solid pink;
    border-radius: 15px;`;
    video.id = 'video' + count;
    video_container.appendChild(video);
  }
  return video;
};
