---
title: "Three.js 추상화?"
excerpt: "Three.js 추상화에 대해 배워보았습니다."
coverImage: "/assets/blog/threejs/abstract/cover.png"
date: "2026-04-16"
ogImage:
  url: "/assets/blog/threejs/abstract/cover.png"
category: frontend
---

## Three.js를 공부하게 된 배경
(참고)[THREE.JS 강좌 : 2. WebGPU에 대한 THREE.JS 추상화](https://www.youtube.com/watch?v=NxLc2Oc0R7w&t=19s)

- 실제로 <strong>추상화된 `Three.js`</strong>만을 이용해서 개발하면, 상용 개발에 있어서 벽에 부딪힌다.
- 그래서, 근간이 되는 <strong>`WebGPU`</strong>에 대한 어느정도의 내용을 알아야한다.


## WebGPU API만을 이용한 간단한 3D 그래픽 코딩
1. **프로젝트 생성하기**
   - `npm create vite@latest .`로 `vite` 프로젝트 생성
   - `vanilla`, `JavaScript`, `no(기본 패키지 설치)`로 진행
   - `npm install` -> `npm run dev`로 실행
2. **`index.html` 수정**
  - `<div id="app"></div>` 삭제
  - `<canvas id="gpuCanvas"></canvas>` 추가
    - 해당 캔버스에서 **3D 그래픽이 렌더링** 될 예정
3. **`style.css` 수정**
   - 기존 코드 모두 삭제
   - 아래 코드 입력 
   ```css
   html, body{
    margin:0;
    overflow:hidden;
   }
   #gpuCanvas{
    width:100%;
    height:100%;
   }```

4. **`main.js` - WebGPU 지원 여부 검사**
  - `WebGPU`는 **CPU에서 GPU가 실행할 명령들을 만들어 GPU에게 전달**해주는데, <br/>**CPU와 GPU간의 통신에 병목현상을 최소화**하기 위해서 **비동기 API**를 호출한다. <br/> 이를 위해서 `async`로 `main` 함수를 정의한다.

5. **`main.js` - adapter와 device 얻기**
  - `device.lost~~` 코드는 **절전모드와 같이 디바이스가 소실되었을 때**, 이에 대한 **에러를 처리하기** 위한 코드이다.
  - <strong>`Adapter`</strong> : 실제 **물리적 GPU 장치** (type : `GPUAdapter`)
  - <strong>`Device`</strong> : **논리적 GPU 인터페이스**로 실제 GPU와 통신을 위해 사용 (type : `GPUDevice`)

6. **-1 WebGPU context 얻기** 
   - `const context = canvas.getContext("webgpu");`로 <strong>`WebGPU` 컨텍스트</strong>를 얻는다.

7. **-2 context에 WebGPU와 호환되는 구성을 세팅** 
  - `alphaMode: 'opaque'`란? 
    - <strong>`WebGPU`로 렌더링된 결과가 완전히 불투명</strong>하다는 것을 의미한다. 
    - 이렇게 설정하면, **GPU가 렌더링 결과를 최적화**할 수 있다. 
    - 만약 **투명한 요소가 포함된 장면을 렌더링**하려면, `alphaMode: 'premultiplied'`로 설정해야한다.

8. **-1 삼각형의 3개의 정점 정의**
    - **삼각형을 렌더링**하기 위해서는 삼각형을 구성하는 **3개의 정점**이 필요하다.

9.  **-2 GPU 메모리 생성**
  - `usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST` : **용도를 명확히 지정**한다.

10. **-3. GPU 메모리에 복사.**

#### 중간 과정 : 개요
- **삼각형을 움직이고, 뷰 전환** 등이 가능하게 하려면 아래의 과정이 필요하다
- **로컬 정점** -> <strong>`Model` 변환</strong> -> <strong>`View` 변환</strong> -> <strong>`Perspective` 변환</strong> -> <strong>뷰포트 변환</strong>(`WebGPU`에서 처리) -> <strong>화면 2D 좌표</strong>(`WebGPU`에서 처리)
- 로컬 정점을 `Model` 변환, `View` 변환 그리고 `Perspective` 변환을 하는 것은 **행렬**을 이용한다. 

#### 중간 과정 : 행렬 
- <strong>`Model` 변환 4X4 행렬 M</strong>, <strong>`View` 변환 4X4 행렬 V</strong>, <strong>`Perspective` 변환 4X4 행렬 P</strong>, 각각 1개씩 **총 3개의 행렬**이 필요하다.
- 3개의 행렬을 **GPU에게 전달**해서 **행렬 연산을 GPU를 이용해 진행**해야한다.

11. **-1. 행렬 구성**
- 하나의 행렬은 **16개의 실수**로 구성된다.
- 따라서, <strong>한 개의 행렬 데이터 크기는 `16 * 4`</strong> (실수값 1개가 `4byte` 이기 때문) 
- <strong>총 3개의 행렬 데이터 크기는 `16 * 4 * 3`</strong>

11. **-2. GPU 메모리 할당**
- 삼각형은 용도에 `VERTEX`이라 지정했다면, <strong>행렬은 `UNIFORM`이라 지정</strong>함에 유의

12. **-1. `Model` 행렬 정의하기 위한 함수 정의**
```js
function mat4Identity() {
  return new Float32Array([
    1, 0, 0, 0, 
    0, 1, 0, 0, 
    0, 0, 1, 0, 
    0, 0, 0, 1,
  ]);
}
```
   - 반환된 행렬은 **삼각형을 이동하고 크기 조정**하는데 쓰이는데, 해당 행렬은 **단위 행렬**로 **회전도, 이동도, 크기 조정도 없는 기본 행렬**이다.
   - 단위 행렬이란?

12. **-2. `View` 행렬을 정의하기 위한 함수 정의**
   - `eye`는 **카메라의 위치**, `center`는 **카메라가 바라보는 위치**, `up`은 **카메라의 회전 방향**을 나타낸다.
   - **3개의 인자값**을 수학적 연산을 통해 **4X4 행렬을 반환**한다.

12. **-3. `Perspective` 행렬을 정의하기 위한 함수 정의**
- `fovY`는 **카메라의 화각**을 나타낸다. `aspect`는 **카메라 필름에 대한 비율**을 나타낸다.
- `near`, `far`은 거리값으로 **카메라가 볼 수 있는 범위**를 지정한다.
- 해당 행렬을 통해서 **원근감**을 나타낼 수 있다.

12. **-4 정의된 함수로 행렬 정의하기**

13. **정의된 행렬을 GPU에 복사하기**
  - **3개의 정점**과, **3개의 행렬 데이터**를 GPU에 전달 완료한다.

14. **셰이더** 
  - 앞서 전달했던 데이터를 실행하기 위한 <strong>`WGSL`</strong>이라는 셰이더가 필요하다.
  - 쉐이더는 <strong>`VERTEX_SHADER`</strong>와 <strong>`FRAGMENT_SHADER`</strong>가 필요하다.
  - <strong>`VERTEX_SHADER`</strong>는 **GPU가 삼각형의 정점 데이터를 처리하는 방법**을 정의한다.
    - 즉, 삼각형을 구성하는 <strong>로컬 정점을 순차적으로 `Model` 변환 -> `View` 변환 -> `Projection` 변환</strong>까지 실행하는 과정, <br/>즉 **삼각형의 계산을 실행하는 코드**가 `VERTEX_SHADER`에 작성된다.
  - <strong>`FRAGMENT_SHADER`</strong>는 `VERTEX_SHADER`를 이용해서 **화면의 픽셀을 결정**할 수 있고, **그 픽셀의 색상값을 정의**한다.

15. **GPU 메모리에 어떤 종류의 데이터가 있고, 어디서 읽어야 하는지 판단 (`Bind Group Layout` 정의)**
  - 이러한 **레이아웃 설정은 유니폼에 대한 버퍼 데이터에 대해 꼭 필요**
  - 앞서 정의한 **세 개의 행렬을 저장하기 위한 유니폼 버퍼**에 대한 것입니다.
  
16. **쉐이더와 `Bind Group Layout`을 이용해서 렌더링 파이프라인 객체를 생성**하면 렌더링 준비는 끝

17. 앞선 **쉐이더 코드를 아직 컴파일 하지 않았는데**, 실제로 **GPU에서 실행하려면 컴파일** 되어야한다.
  ```js
  const vertexModule = device.createShaderModule({ code: VERTEX_SHADER });
    const fragmentModule = device.createShaderModule({ code: FRAGMENT_SHADER });
  ```
  - 근데 이러면, **컴파일 할 때 문제가 있는지 파악할 수 없다**.
  - 이를 위해 아래 코드를 추가한다.
  ```js

  const vertInfo = await vertexModule.getCompilationInfo();
  vertInfo.messages.forEach((m) =>
    console[m.type === "error" ? "error" : "warn"](`[Vertex shader] ${m.message}`),
  );

  const fragInfo = await fragmentModule.getCompilationInfo();
  fragInfo.messages.forEach((m) =>
    console[m.type === "error" ? "error" : "warn"](`[Fragment shader] ${m.message}`),
  );
  ```

18.  **컴파일된 `ShaderModule`과 `Bind Group Layout`을 이용해서 렌더링 파이프라인 객체를 생성**해야 한다.
  - **파이프라인이란** **어떤 쉐이더를 이용하고, 사용할 데이터는 어떤 형식이며, 정점들은 어떻게 렌더링할 것인지**에 대한 **실행 규칙 흐름을 정의한 객체** 

| 요소 | 설명 | 타입 |
|---|---|---|
| Adapter | 실제 물리적 GPU 장치 | GPUAdapter |
| Device | 논리적 GPU 인터페이스로 실제 GPU와 통신을 위해 사용 | GPUDevice |
| Shader | WGSL(WebGPU Shading Language)로 정점의 위치 계산 및 픽셀의 색상 결정 등 | GPUShaderModule |
| Pipeline | 어떤 쉐이더를 사용하고 데이터는 어떤 형식이며 어떻게 렌더링할 것인가와 같은 규칙의 흐름을 정의한 객체 | GPURenderPipeline, GPUComputePipeline |
| Command Encoder | GPU에 보낼 작업 내역들(Render Pass, Compute Pass)을 기록함 | GPUCommandEncoder |
| Command Buffer | Command Encoder에 기록된 작업들을 GPU가 실제로 실행될 수 있는 형태로 만든 데이터 | GPUCommandBuffer |
| Pass | Render Pass와 Compute Pass가 있으며 Command Encoder가 Command Buffer를 만들 때 저장하는 것 | GPURenderPassEncoder, GPUComputePassEncoder |
| Queue | Command Buffer에 저장된 실행 명령(Pass)을 GPU(정확히는 실행 Pipeline)로 전달할 때 사용하는 통로 | GPUQueue |
   - 위 표를 보면, 삼각형을 렌더링하기 위해서는 **GPU 렌더 파이프라인 타입의 객체, 즉 `GPURenderPipeline`이 필요**하다는 것을 알 수 있다.
   - <strong>`GPURenderPipeline`</strong> : GPU가 **3D 그래픽 렌더링**을 수행하기 위해 필요한 **전체 절차가 정의된 객체**
   - <strong>`GPUComputePipeline`</strong> : GPU가 **범용적인 계산 작업**을 수행하기 위해 필요한 **전체 절차가 정의된 객체**


1.  **렌더링**
    - 렌더링을 위해 **실행할 명령을 수집해서 기록**을 해두어야한다.
    - 이를 위해 **`Command Encoder` 객체**가 필요하다.
    - 렌더링을 위해 **렌더 패스 객체를 `Command Encoder` 객체를 통해 생성**한다.
    - **화면에 그려질 프레임 버퍼 텍스처**를 뷰에 지정한다.
    - <strong>`loadOp`</strong>은 `clearValue`로 지정된 색상으로 **프레임 버퍼를 초기화**한다는 것을 의미하며, <br/><strong>`storeOp`</strong>은 렌더패스가 끝나면 **그 결과를 텍스쳐에 저장**하라는 의미.
    - 렌더 패스가 사용할 **파이프라인을 지정**하고, **`Model`, `View`, `Perspective` 행렬이 저장된 유니폼 데이터**를 해당 렌더패스에 연결하고, <br/>**삼각형의 정점 데이터**에 대한 데이터도 렌더패스에 연결한다.
    - `renderPass.end();` 까지가 **GPU가 실행할 명령어를 수집하는 것**
    - **수집된 커맨드 버퍼를 디바이스에 큐를 통하여 전달**하면 삼각형이 등장한다.

#### 이슈 : **삼각형이 안나오는 문제**
    - **상황** : 위의 과정을 모두 마쳤는데, **삼각형이 화면에 나타나지 않는 문제 발생**
    - **원인** 
      - `HTML`에 `canvas`가 아닌 `div` 요소로 정의되어 있었음
      - `const context = document.getElementById("gpuCanavs");`이 **`gpuCanavs`로 오타**가 있었음
      - `const context = document.getElementById("gpuCanvas");` <br/>`const canvas = canvas.getContext("webgpu");` -> **`canvas`가 `context`로 오타**, **`canvas`와 `context`가 서로 바뀌어 있는 오타**.
      - `@group(0) @binding(0) var<uniform> matrices : Matrices;` 인데 **`matrices`가 아니라 `mvp`로 오타**
       - `struct VertexInput { @location(0) position : vec4<f32>, };` -> **버퍼는 `float32x3` 이므로 `position`이 `vec3<f32>`여야함**

  - **해결!** 삼각형이 화면에 나타남
  ![삼각형 이미지](/assets/blog/threejs/abstract/triangle-1.png)

#### (참고) WebGPU의 구성요소
- <strong>`Command Encoder`</strong> : **GPU에 보낼 작업 내역들**(`Render Pass`, `Compute Pass`)을 기록함
- <strong>`Command Buffer`</strong> : `Command Encoder`에 기록된 작업들을 **GPU가 실제로 실행될 수 있는 형태로 만든 데이터**
- <strong>`Queue`</strong> : `Command Buffer`에 저장된 <strong>실행 명령(`Pass`)을 GPU</strong>(정확히는 실행 `Pipeline`)<strong>로 전달할 때 사용하는 통로</strong>

### 전체 코드
```js
import "./style.css";

// Model 행렬을 정의하기 위한 함수
function mat4Identity() {
  return new Float32Array([
    1,
    0,
    0,
    0, //
    0,
    1,
    0,
    0, //
    0,
    0,
    1,
    0, //
    0,
    0,
    0,
    1,
  ]);
}

// View 행렬을 정의하기 위한 함수
function mat4LookAt(eye, center, up) {
  const ex = eye[0],
    ey = eye[1],
    ez = eye[2];
  const cx = center[0],
    cy = center[1],
    cz = center[2];

  let ux = up[0],
    uy = up[1],
    uz = up[2];

  let fx = ex - cx,
    fy = ey - cy,
    fz = ez - cz;
  let len = Math.hypot(fx, fy, fz);
  fx /= len;
  fy /= len;
  fz /= len;

  let rx = uy * fz - uz * fy,
    ry = uz * fx - ux * fz,
    rz = ux * fy - uy * fx;
  len = Math.hypot(rx, ry, rz);
  rx /= len;
  ry /= len;
  rz /= len;

  ux = fy * rz - fz * ry;
  uy = fz * rx - fx * rz;
  uz = fx * ry - fy * rx;

  return new Float32Array([
    rx,
    ux,
    fx,
    0, //
    ry,
    uy,
    fy,
    0, //
    rz,
    uz,
    fz,
    0, //
    -(rx * ex + ry * ey + rz * ez),
    -(ux * ex + uy * ey + uz * ez),
    -(fx * ex + fy * ey + fz * ez),
    1,
  ]);
}

// Perspective 행렬을 정의하기 위한 함수
function mat4Perspective(fovY, aspect, near, far) {
  const f = 1.0 / Math.tan(fovY / 2);
  const nf = 1 / (near - far);

  return new Float32Array([
    f / aspect,
    0,
    0,
    0, //
    0,
    f,
    0,
    0, //
    0,
    0,
    (far + near) * nf,
    -1, //
    0,
    0,
    2 * far * near * nf,
    0,
  ]);
}

async function main() {
  //1.WebGPU 지원 여부 검사
  if (!navigator.gpu) {
    console.error("WebGPU를 지원하지 않습니다.");
    return;
  }

  //2. adapter와 device 얻기
  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    console.error("적절한 GPU 어댑터를 찾을 수 없습니다.");
    return;
  }
  const device = await adapter.requestDevice();
  device.lost.then((info) => {
    console.error("Device 소실 :", info.message, "| 원인 :", info.reason);
  });

  //3-1. Canvas와 context 설정
  const canvas = document.getElementById("gpuCanvas");
  const context = canvas.getContext("webgpu");
  if (!context) {
    console.error("캔버스로부터 WebGPU 컨텍스트를 얻을 수 없습니다.");
    return;
  }

  //3-2 WebGPU와 호환되는 구성 세팅
  const format = navigator.gpu.getPreferredCanvasFormat();
  context.configure({ device, format, alphaMode: "opaque" });

  //4-1. 삼각형의 3개의 정점 정의
  const vertices = new Float32Array([
    0.0,
    0.6,
    0.0, // 위쪽 정점
    -0.5,
    -0.4,
    0.0, // 왼쪽 정점
    0.5,
    -0.4,
    0.0, // 오른쪽 정점
  ]);

  //4-2. GPU 메모리 생성
  const vertexBuffer = device.createBuffer({
    size: vertices.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });

  //4-2. CPU가 읽을 수 있는 메모리에서 GPU 메모리로 복사
  device.queue.writeBuffer(vertexBuffer, 0, vertices);

  const MATRIX_SIZE = 16 * 4;
  const UNIFORN_SIZE = 3 * MATRIX_SIZE;

  const uniformBuffer = device.createBuffer({
    size: UNIFORN_SIZE,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  //5. 정의된 함수로 행렬 정의하기
  const model = mat4Identity();

  const view = mat4LookAt(
    [0, 0, 2], // eye
    [0, 0, 0], // center
    [0, 1, 0], // up
  );

  const aspect = canvas.width / canvas.height;
  const projection = mat4Perspective((60 * Math.PI) / 180, aspect, 0.1, 100);

  // 6. 정의된 행렬을 GPU에 복사하기
  device.queue.writeBuffer(uniformBuffer, 0, model);
  device.queue.writeBuffer(uniformBuffer, MATRIX_SIZE, view);
  device.queue.writeBuffer(uniformBuffer, 2 * MATRIX_SIZE, projection);

  // 7. 셰이더 코드 정의하기
  const VERTEX_SHADER = /*wgsl*/ `
    struct Matrices { //GPU로 전달할 행렬들을 정의하는 구조체
      model : mat4x4<f32>, // GPU로 전달한 Model 행렬
      view : mat4x4<f32>, // GPU로 전달한 View 행렬
      projection : mat4x4<f32>, // GPU로 전달한 Projection 행렬
    };

    // 이 구조체에 실제 데이터를 채우고 읽기 위해서 group과 binding을 설정
    // 0번 그룹과 0번 바인딩을 통해서 행렬 데이터를 읽기 위해서 별도의 코드가 필요 -> 추후 다시 설명
    @group(0) @binding(0) var<uniform> mvp : Matrices; 

    // 삼각형의 정점 데이터를 정의하는 구조체
    // 0번 location을 사용하여 정점의 위치 데이터를 읽기 위해서 별도의 코드가 필요 -> 추후 다시 설명
    struct VertexInput {
      @location(0) position : vec3<f32>,
    };

    // 정점 셰이더의 최종 결과값에 대한 구조체
    struct VertexOutput {
      @builtin(position) clip_position : vec4<f32>,
    };

    @vertex
    // 정점 셰이더의 메인 함수 인자로 정점 데이터를 읽기 위한 구조체를 받음
    
    fn vs_main(in: VertexInput) -> VertexOutput {
      var out : VertexOutput;
      let mvp_matrix = mvp.projection * mvp.view * mvp.model; // 모델 변환, 뷰 변환, 프로젝션 변환에 대한 행렬을 만들고, 
      out.clip_position = mvp_matrix * vec4<f32>(in.position, 1.0); // 이 행렬에 정점의 로컬 좌표를 곱한 결과를 반환하고 있다.

      return out;
    }
  `;

  const FRAGMENT_SHADER = /*wgsl*/ `
    @fragment
    fn fs_main() -> @location(0) vec4<f32> {
      return vec4<f32>(1.0, 1.0, 0.0, 1.0); // R: 1.0, G: 1.0, B: 0.0, A: 1.0 -> 노란색으로 출력
    }
  `;

  // 8. Bind Group Layout (어떤 위치에 어떤 종류의 데이터가 들어오는지에 대한 설계도) 설정

  const bindGroupLayout = device.createBindGroupLayout({
    entries: [
      {
        binding: 0, // VERTEX_SHADER에서 bindding(0)에 대한 값과 일치해야함, 0번 바인딩에 대한 설정
        visibility: GPUShaderStage.VERTEX, // 이렇게 지정하면 -> 여기서 바인딩된 데이터는 VERTEX_SHADER에서만 읽을 수 있다는 것을 의미.
        buffer: { type: "uniform" },
        // 이 데이터는 uniform이라는 의미,
        // uniform 버퍼는 생성될 때 uniform 타입으로 생성되고 있으니까 , 타입을 맞춰야한다.
        //  -> usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      },
    ],
  });

  // 위 bindGroupLayout을 기반으로 실제 데이터를 바인딩하는 Bind Group 설정
  const bindGroup = device.createBindGroup({
    layout: bindGroupLayout, // 사용할 레이아웃은 위에서 정의한 bindGroupLayout
    entries: [
      {
        binding: 0, // bindGroupLayout 의 entries의 첫번째 요소에 바인딩 되라는 의미
        resource: { buffer: uniformBuffer }, // 실제 바인딩 되는 데이터는 uniformBuffer, 이 버퍼는 위에서 생성한 uniform 버퍼
      },
    ],
  });

  // 9. Shader 컴파일
  const vertexModule = device.createShaderModule({ code: VERTEX_SHADER });
  const fragmentModule = device.createShaderModule({ code: FRAGMENT_SHADER });

  const vertInfo = await vertexModule.getCompilationInfo();
  vertInfo.messages.forEach((m) =>
    console[m.type === "error" ? "error" : "warn"](`[Vertex shader] ${m.message}`),
  );

  const fragInfo = await fragmentModule.getCompilationInfo();
  fragInfo.messages.forEach((m) =>
    console[m.type === "error" ? "error" : "warn"](`[Fragment shader] ${m.message}`),
  );

  // 10. Render Pipeline (렌더링 과정에 대한 설계도) 설정
  const pipeline = device.createRenderPipeline({
    layout: device.createPipelineLayout({ bindGroupLayouts: [bindGroupLayout] }), // 사용할 Bind Group Layout은 위에서 정의한 bindGroupLayout
    vertex: {
      module: vertexModule, // 사용할 Vertex Shader는 위에서 컴파일한 vertexModule
      entryPoint: "vs_main", // Vertex Shader의 진입점은 vs_main 함수
      buffers: [
        {
          arrayStride: 3 * 4, // 정점 데이터의 한 요소가 차지하는 바이트 수, 여기서는 position이 vec3<f32>이니까 3개의 float, 각 float는 4바이트 -> 3 * 4
          attributes: [
            {
              shaderLocation: 0, // 쉐이더 location(0)과 연결
              offset: 0, // position 데이터는 정점 데이터의 시작 부분에 위치하니까 offset은 0
              format: "float32x3", // position 데이터는 vec3<f32>이니까 float 3개짜리 데이터
            },
          ],
        },
      ],
    },
    fragment: {
      module: fragmentModule, // 사용할 Fragment Shader는 위에서 컴파일한 fragmentModule
      entryPoint: "fs_main", // Fragment Shader의 진입점은 fs_main 함수
      targets: [
        // 렌더링 결과가 출력될 대상에 대한 설정
        {
          format, // 출력 대상의 포맷은 위에서 설정한 format, 여기서는 navigator.gpu.getPreferredCanvasFormat()로 얻은 값
        },
      ],
    },
    primitive: {
      topology: "triangle-list", // 렌더링할 도형의 유형, 여기서는 정점 3개를 묶어 삼각형 1개를 그리는 방식
    },
  });

  // 11. Command Encoder와 Render Pass Encoder를 사용하여 실제 렌더링 명령어 작성
  function render() {
    const commandEncoder = device.createCommandEncoder(); // 명령어를 기록하기 위한 Command Encoder 생성

    const renderPass = commandEncoder.beginRenderPass({
      colorAttachments: [
        {
          view: context.getCurrentTexture().createView(), // 렌더링 결과가 출력될 대상, 여기서는 캔버스의 현재 텍스처 뷰
          clearValue: { r: 0.05, g: 0.05, b: 0.08, a: 1.0 }, // 초기화할 색상, 여기서는 검은색
          loadOp: "clear", // 렌더링 시작 전에 이 대상에 대한 작업, 여기서는 clear -> 렌더링 시작 전에 이 대상이 지정된 색상으로 초기화됨
          storeOp: "store", // 렌더링이 끝난 후 이 대상에 대한 작업, 여기서는 store -> 렌더링 결과가 이 대상에 저장됨
        },
      ],
    });

    // 위에서 설정한 Render Pipeline을 사용하겠다는 의미
    renderPass.setPipeline(pipeline);
    // 위에서 설정한 Bind Group을 0번 그룹으로 바인딩,
    // 이로써 셰이더에서 @group(0) @binding(0)으로 정의된 uniform 데이터가 이 bindGroup의 uniformBuffer를 참조하게 됨
    renderPass.setBindGroup(0, bindGroup);
    renderPass.setVertexBuffer(0, vertexBuffer);
    renderPass.draw(3); // 정점 3개를 사용해서 1개의 인스턴스를 그리겠다는 의미
    renderPass.end(); // Render Pass 종료

    const commandBuffer = commandEncoder.finish(); // 명령어 기록 종료, Command Buffer 생성
    device.queue.submit([commandBuffer]); // Command Buffer를 GPU에 제출하여 실행
  }

  render();
}

main();
```

## WebGPU에서 중요한 장점
1. <strong>`Pipeline`을 통한 사전 준비 가능</strong>
  ```js
  const pipeline = device.createRenderPipeline({
    // 렌더링 과정에 대한 설계도
  });
  ```
  - <strong>`WebGL`은 상태 관리 방식</strong> : 렌더링 과정에서 필요한 설정들을 **렌더링 명령어를 실행하기 전에 여러가지 상태를 매번 새롭게 지정**하여 렌더링하는 방식
    - 지정된 **상태가 올바른지 매 프레임마다 CPU가 검사**해야함.
  - <strong>`WebGPU`는 파이프라인 방식</strong> : 렌더링 과정에 필요한 설정들을 **미리 무엇을 렌더링할지를 정의**하고, <br/>즉 **파이프라인 객체로 만들어서 GPU에게 전달**하는 방식, **미리 정의해 검증된 상태로 CPU에 추가적인 부담을 주지 않는다**.
2. <strong>멀티스레드(`Worker`)를 통한 최적화 작업이 가능하다.</strong>
  ```js
  const commandBuffer = commandEncoder.finish(); 
  device.queue.submit([commandBuffer]);
  ```
  - 코드를 보면 <strong>메인 쓰레드에서 `commandBuffer`를 한 개만 만들었지만</strong>, `commandBuffer`를 **별도의 쓰레드에서 만들어서 메인 쓰레드로 전달**할 수 있다. <br/>메인 쓰레드에서 <strong>디바이스의 큐를 통해 워커에서 전달한 `commandBuffer`를 배열 형태로 전달</strong>해서 실행할 수 있다. <br/>`WebGPU`는 **배열로 전달된 커맨드 버퍼를 이 배열의 순서에 맞게 실행**할 수 있도록 보장한다.
3. <strong>3D 그래픽 뿐만 아니라 `GPGPU` 이용</strong>
  - <strong>`WebGL`도 가능했지만</strong> 코드 작성이 매우 **비효율적이고, 직관적이지 못한 방식**이었다.
  - <strong>`WebGPU`는 `Compute Shader`를 이용해서 `GPGPU`를 정식 지원</strong>한다.

## WebGPU에 대한 three.js 추상화
- <strong>`WebGPU`를 추상화한 `three.js`의 기본 구성 요소 및 API</strong>
- `three.js`의 <strong>`WebGPURenderer`는 `WebGPU API`를 추상화</strong>하여 **개발자가 더 쉽게 3D 그래픽을 렌더링**할 수 있도록 도와준다. <br/>`WebGPURenderer`는 <strong>`WebGPU`의 복잡한 설정과 관리를 내부적으로 처리</strong>하여, <br/>개발자는 <strong>`three.js`의 친숙한 API</strong>를 사용하여 **3D 씬을 구성하고 렌더링**할 수 있다.
- <strong>`THREE.WebGPURenderer`</strong>
  - <strong>`WebGPU`와 `canvas`를 초기화</strong> 해주는 부분이며 **렌더 파이프라인을 생성**해주는 코드, <br/>그리고 <strong>`command encoder`를 생성하고 `command buffer`를 관리</strong>하고 **실제 렌더링까지 해주는 부분**을 담당한다.
- <strong>`THREE.Geometry`</strong>
  - **정점 데이터를 정의하고 GPU에 버퍼를 생성**해서 구성해주는 부분, <br/>즉 **3D 모델의 정점, 법선, 텍스처 좌표** 등의 데이터를 관리하는 부분
- <strong>`THREE.Material`</strong>
  - **쉐이더 코드**에 대한 부분, 그리고 **유니폼 데이터(바인드 데이터)**에 대한 코드도 해당된다.
- <strong>`THREE.Mesh`</strong>
  - 전체 코드에서 정확히 짚을 수는 없지만, <strong>`Geometry`와 `Material`을 조합해서 실제로 효과적으로 관리</strong>할 수 있도록 한다.
- <strong>`THREE.Scene`</strong>
  - **여러 개의 매시를 효과적으로 관리**할 수 있는 클래스 
- <strong>`THREE.Camera`</strong>
  - <strong>`View` 변환과 `Projection` 변환</strong>에 대한 부분을 담당한다. <br/>그리고 해당 행렬을 생성하기 위한 `mat4LookAt`과 `mat4Perspective`와 같은 함수도 <strong>`Camera` 클래스에서 제공</strong>한다.
- <strong>`THREE.Light`</strong>
  - **빛의 위치, 색상, 세기** 등을 정의하는 클래스, 그리고 **쉐이더에서 빛의 영향을 계산하기 위한 코드**도 포함한다. <br/>(해당 코드에선 명확하지 않으나 작성된다면 `FRAGMENT_SHADER`에서 **빛의 영향을 계산하는 코드**가 추가될 것이다.)
- <strong>`THREE.MathUtils`</strong>
  - **3차원 좌표와 행렬을 효과적으로 표현**할 때 사용, **수학적 연산에 대한 다양한 함수를 제공**, <br/>코드에서는 <strong>단위 행렬을 얻는 `mat4Identity`</strong>와 같은 함수가 이에 해당한다.

## 결론
<strong>`WebGPU`에 대한 `Three.js`의 추상화</strong>는 **복잡한 `WebGPU API`를 간단하고 직관적인 인터페이스로 감싸서** 개발자가 3D 그래픽을 쉽게 렌더링할 수 있도록 도와준다.<br/> 하지만 <strong>`WebGPU`를 통해 기초부터 만들어보면서 내부를 이해</strong>한다면, 수학적인 내용과 쉐이더에 대해 더 알면 알수록,더 멋진 효과와 장면을 만들 수 있다고 합니다!

#### 추가) `Perspective` vs `Projection` 의 차이점?
강의에서 Perspective 변환과 Projection 변환이 같은 행렬을 가리키는 것처럼 쓰이는 것 같은데, 차이점은?
- 답변 : 
  - Projection 변환은 3d를 모니터에 표시하기 위해 2d로 변환하는 것을 의미
  - 이 projection 변환에는 2가지가 있는데 perspective 변환과 orthographic 변환
  - 각각은 원근감이 있고 없고에 대한 차이

