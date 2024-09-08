'use client';

import { useEffect } from 'react';

import shader from '../shaders/shaders.wgsl';

export default function RenderByGpu() {
  const gpu = navigator.gpu;

  const init = async () => {
    const canvas = document.getElementById('gfx-main') as HTMLCanvasElement;
    const adapter: GPUAdapter = (await gpu.requestAdapter()) as GPUAdapter;
    const device: GPUDevice = (await adapter.requestDevice()) as GPUDevice;
    if (!adapter) {
      alert('Failed to request Adapter. WebGPU not supported');
      return false;
    }
    if (!device) {
      alert('Failed to request Device. WebGPU not supported');
      return false;
    }
    const context: GPUCanvasContext = canvas.getContext(
      'webgpu'
    ) as GPUCanvasContext;
    const format: GPUTextureFormat = 'bgra8unorm';
    context.configure({
      device: device,
      format: format,
      alphaMode: 'opaque',
    });

    const bindGroupLayout = device.createBindGroupLayout({
      entries: [],
    });

    const bindGroup = device.createBindGroup({
      layout: bindGroupLayout,
      entries: [],
    });

    const pipelineLayout = device.createPipelineLayout({
      bindGroupLayouts: [bindGroupLayout],
    });

    const pipeline: GPURenderPipeline = device.createRenderPipeline({
      vertex: {
        module: device.createShaderModule({
          code: shader,
        }),
        entryPoint: 'vs_main',
      },
      fragment: {
        module: device.createShaderModule({
          code: shader,
        }),
        entryPoint: 'fs_main',
        targets: [
          {
            format: format,
          },
        ],
      },
      primitive: {
        topology: 'triangle-list',
      },
      layout: pipelineLayout,
    });

    const commandEncoder: GPUCommandEncoder = device.createCommandEncoder();
    const textureView: GPUTextureView = context
      .getCurrentTexture()
      .createView();
    const renderPass: GPURenderPassEncoder = commandEncoder.beginRenderPass({
      colorAttachments: [
        {
          view: textureView,
          clearValue: { r: 0.5, g: 0.0, b: 0.25, a: 1.0 },
          loadOp: 'clear' as GPULoadOp,
          storeOp: 'store' as GPUStoreOp,
        },
      ],
    });
    renderPass.setPipeline(pipeline);
    renderPass.setBindGroup(0, bindGroup);
    renderPass.draw(3, 1, 0, 0);
    renderPass.end();
    device.queue.submit([commandEncoder.finish()]);
  };

  useEffect(() => {
    init();
  }, []);
  return <canvas id="gfx-main" width="800" height="600"></canvas>;
}
