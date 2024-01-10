import {
	fabric
} from "fabric";

export default class rwFabric {

	//new初始化，这个方法都会走
	constructor(id) {
		this._id = id;
		this._canvas = null;
	}


	//初始化SVG
	initSVG(opt) {
		this._canvas = new fabric.Canvas(this._id, {
			backgroundVpt: opt.backgroundVpt | false, // 不受视口变换影响（也就是不管拖拽还是缩放画布，背景图都不受影响）
			isDrawingMode: opt.isDrawingMode | false, //设置是否可以绘制
			selectable: false, //设置是否可以选中拖动  fabric提供的
			selection: opt.selection | false,
			interactive: opt.interactive | false, // 隐藏交互模式
			fireRightClick: opt.fireRightClick | false, // 启用右键，button的数字为3
			stopContextMenu: opt.stopContextMenu | false, // 禁止默认右键菜单
			centeredScaling: true, // 元素中心点缩放
			devicePixelRatio: true, // Retina 高清屏 屏幕支持
			selectionColor: 'transparent',
			selectionBorderColor: 'transparent',
			skipTargetFind: false // 禁止选中
		});
		this._canvas.renderOnAddRemove = true
	}


	//设置背景图
	initSvgScene(opt) {
		var that = this
		fabric.Image.fromURL(opt.imgUrl, (oImg) => {
			oImg.set({
				// 通过scale来设置图片大小，这里设置和画布一样大
				// scaleX: that._canvas.width / oImg.width,
				// scaleY: that._canvas.height / oImg.height,
				scaleX: 1,
				scaleY: 1,
			});
			oImg.id = "-1" //默认为背景
			// 设置背景
			that._canvas.setBackgroundImage(oImg, that._canvas.renderAll.bind(that._canvas));
		});

	}

	/**
	 * 获取所有对象
	 */
	getObjects() {
		return this._canvas.getObjects()
	}
	
	//根据id查找对象
	getObjectById(id) {
		for (var i = 0; i < this.getObjects().length; i++) {
			if(this.getObjects()[i].id === id){
				return this.getObjects()[i]
			}
		}
		return null
	}
	
	/**
	 * 设置活动对象
	 */
	setActiveObject(o) {
		this._canvas.setActiveObject(o)
		this.renderAll()
	}
	//刷新组件状态
	renderAll() {
		this._canvas.renderAll();
	}

	remove(o) {
		this._canvas.remove(o)
	}

	removeById(id) {
		for (var i = 0; i < this.getObjects().length; i++) {
			if(this.getObjects()[i].id === id){
				this.remove(this.getObjects()[i])
			}
		}
	}

	// =======================创建对象=====================================//
	//创建文本
	createSvgText(opt) {
		var text = new fabric.Text(opt.text, {
			id: opt.id,
			left: opt.left,
			top: opt.top
		});
		text.set({
			transparentCorners: false,
			cornerColor: 'blue',
			cornerStrokeColor: 'red',
			borderColor: 'red',
			cornerSize: 12,
			padding: 10,
			cornerStyle: 'circle',
			borderDashArray: [3, 3]
		});
		this._canvas.add(text);
	}


	//创建文本和图标
	createSvgImgAndText(opt) {
		var that = this
		// let result = [];
		fabric.Image.fromURL(opt.imgUrl, oImg => {
			oImg.scale(1).set({
				left: opt.imgLeft,
				top: opt.imgTop,
				width: opt.imgWidth,
				height: opt.imgHeight,
				angle: opt.imgAngle, //旋转角度
				selectable: false, //设置是否可以选中拖动  fabric提供的
			});

			const text = new fabric.Text(opt.text, {
				fontSize: opt.textFontSize,
				top: opt.textTop,
				left: opt.textLeft,
				angle: opt.textAngle, //旋转角度

			})
			text.set({
				fill: 'white'
			})

			let group = new fabric.Group([oImg, text])
			group.id = opt.id//给对象添加自定义属性
			group.set({
				transparentCorners: false,
				cornerColor: 'blue',
				cornerStrokeColor: 'red',
				borderColor: 'red',
				cornerSize: 12,
				padding: 10,
				cornerStyle: 'circle',
				borderDashArray: [3, 3],
				selectable: opt.selectable, //设置是否可以选中拖动  fabric提供的
			});
			// that.lockObject(group)
			that._canvas.add(group)
		})
	}
	//静止操作对象
	lockObject(obj){
		//静止旋转和移动，放大
		obj.setControlsVisibility({
			mt: false,
			mb: false,
			mr: false,
			ml: false,
			tl: false,
			tr: false,
			bl: false,
			br: false,
			mtr: false
		})
		obj.lockMovementX = true
		obj.lockMovementY = true
	}

	//创建图标
	createSvgImg(opt) {
		var that = this
		fabric.Image.fromURL(opt.imgUrl, oImg => {
			oImg.scale(1).set({
				left: opt.left,
				top: opt.top,
				width: opt.width,
				height: opt.height,
				angle: opt.angle, //旋转角度
				// 这里可以通过scaleX和scaleY来设置图片绘制后的大小，这里为原来大小的一半
				scaleX: opt.scaleX,
				scaleY: opt.scaleY,

			});
			oImg.id = opt.id//给对象添加自定义属性
			oImg.set({
				transparentCorners: false,
				cornerColor: 'blue',
				cornerStrokeColor: 'red',
				borderColor: 'red',
				cornerSize: 12,
				padding: 10,
				cornerStyle: 'circle',
				borderDashArray: [3, 3],
				selectable: opt.selectable, //设置是否可以选中拖动  fabric提供的
			});

			that._canvas.add(oImg)
		})
	}

	// =======================创建事件=====================================//
	/**拖东事件
	 */
	initMoveEvent(func) {
		var that = this
		that._canvas.on('object:moving', function(event) {
			var id;
			if (event.target) {
				id = event.target.id
			}
			if (id) {
				that._canvas.getObjects().forEach(function(o) {
					if (o.id === id) {
						if (typeof(func) == 'function') {
							func(o,true)
						}
					}
				})
			} else {
				func("点击空白位置", false)
			}
		});
	}
	/**
	 * 左键up事件
	 */
	initUpEvent(func) {
		var that = this
		that._canvas.on('mouse:up', function(event) {
			var id;
			if (event.target) {
				id = event.target.id
			}
			if (id) {
				that._canvas.getObjects().forEach(function(o) {
					if (o.id === id) {
						if (typeof(func) == 'function') {
							func(o, true)
						}
					}
				})
			} else {
				func("点击空白位置", false)
			}
		});
	}
	/**
	 * 左键down事件
	 */
	initDownEvent(func) {
		var that = this
		that._canvas.on('mouse:down', function(event) {
			if (typeof(func) == 'function') {
				func(event.target)
			}
		});
	}
	/**旋转事件
	 */
	initRotatingEvent(func) {
		var that = this
		that._canvas.on("object:rotating", function(event) {
			if (typeof(func) == 'function') {
				func(event.target)
			}
		});
	}

	/**缩放事件
	 */
	initScalingEvent(func) {
		var that = this
		that._canvas.on("object:scaling", function(event) {
			if (typeof(func) == 'function') {
				func(event.target)
			}
		});
	}

	/**双击
	 * @param {Object} func
	 */
	initDblclickEvent(func) {
		var that = this
		that._canvas.on('mouse:dblclick', function(e) {
			if (typeof(func) == 'function') {
				func(e.target)
			}
		})
	}


	/**右击
	 * @param {Object} func
	 */
	initRightClickEvent(func) {
		window.oncontextmenu = function(e) {
			e.preventDefault()
		}

		var that = this
		that._canvas.on('mouse:down', function(e) {
			if (e.button != 3) {
				return
			}
			if (!e.target) {
				return
			}
			if (typeof(func) == 'function') {
				func(e.target)
			}
		})

	}

	/**移出
	 * @param {Object} func
	 */
	initOutEvent(func) {
		var that = this
		that._canvas.on('mouse:out', function(e) {
			if (typeof(func) == 'function') {
				func(e.target)
			}
		})
	}

	/**移入
	 * @param {Object} func
	 */
	initOverEvent(func) {
		var that = this
		that._canvas.on('mouse:over', function(e) {
			if (typeof(func) == 'function') {
				func(e.target)
			}
		})
	}

	// 创建直线
	createLine(opt) {
		// 创建直线对象
		var line = new fabric.Line([opt.startPoint.x, opt.startPoint.y, opt.endPoint.x, opt.endPoint.y], {
			stroke: opt.color?opt.color:"#c45656",
			strokeWidth: opt.strokeWidth?opt.strokeWidth:4, // 默认设置线条粗细为4像素
		});
		this._canvas.add(line)
	}
}
