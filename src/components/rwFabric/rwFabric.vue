<template>
	<div style="width:100%;height:100%" ref='outW'>
		<canvas id="c" :width="w" :height="h" style="top: 0"></canvas>
	</div>
</template>

<script>
	import RwFabric from './rwFabric.js';
	export default {
		data(){
			return{
				w:0,
				h:0,
				rwFabric:null
			}
		},
		mounted() {
			this.setW()
		},
		created() {
			setTimeout(()=>{
				this.init()
			})
		},
		watch:{},
		methods:{
			setW(){
				let w = this.$refs.outW.offsetWidth
				let h = this.$refs.outW.offsetHeight
				this.w =  w
				this.h =  h
			},
			init(){
				this.rwFabric = new RwFabric("c")
				this.rwFabric.initSVG({
					backgroundVpt: false, // 不受视口变换影响（也就是不管拖拽还是缩放画布，背景图都不受影响）
					isDrawingMode: false, //设置是否可以绘制
					selectable: false, //设置是否可以选中拖动  fabric提供的
					selection: false,
					interactive: true, // 隐藏交互模式
					fireRightClick: true, // 启用右键，button的数字为3
					stopContextMenu: true, // 禁止默认右键菜单
				})
				this.rwFabric.initSvgScene({
					"imgUrl": 'https://img0.baidu.com/it/u=1641416437,1150295750&fm=253&fmt=auto&app=120&f=JPEG?w=1280&h=800'
				})
			},
			createDevice(){
				this.rwFabric.createSvgImgAndText({
					"id": 123,
					"imgUrl": 'https://img0.baidu.com/it/u=1641416437,1150295750&fm=253&fmt=auto&app=120&f=JPEG?w=1280&h=800',
					"imgLeft": 1,
					"imgTop": 1,
					"imgWidth": 50,
					"imgHeight": 50,
					"imgAngle": 0, //旋转角度
					"text": '你好',
					"textFontSize": 12,
					"textTop": 18,
					"textLeft": 44,
					"textAngle": 0, //旋转角度
					"selectable":true
				})
			}
		}
	}
</script>

<style>
</style>
