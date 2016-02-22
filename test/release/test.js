"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

require("babel-polyfill");

var _harmonyReflect = require("harmony-reflect");

var _harmonyReflect2 = _interopRequireDefault(_harmonyReflect);

var _should = require("should");

var _should2 = _interopRequireDefault(_should);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 読み込みテスト
new Promise(function (resolve, reject) {
	describe("Test Loading", function () {
		var classObj = {};
		var promiseList = [];
		var _arr = ["Base", "Inherit", "BaseWithProxy", "InheritWithProxy"];

		var _loop = function _loop() {
			var name = _arr[_i];
			promiseList.push(new Promise(function (resolve, reject) {
				it("load ./" + name + ".js", function () {
					classObj[name] = require("./" + name + ".js");
					resolve();
				});
			}));
		};

		for (var _i = 0; _i < _arr.length; _i++) {
			_loop();
		}
		Promise.all(promiseList).then(function () {
			resolve(classObj);
		}).catch(function (err) {
			reject();
		});
	});
}).then(function (_ref) {
	var Base = _ref.Base;
	var Inherit = _ref.Inherit;
	var BaseWithProxy = _ref.BaseWithProxy;
	var InheritWithProxy = _ref.InheritWithProxy;

	// Proxy使用版のテスト
	describe("Test for Base", function () {
		testClass(Base, "Base");
	});
	describe("Test for Inherit", function () {
		testClass(Inherit, "Inherit");
	});

	// Proxy不使用版のテスト
	describe("Test for Base with Proxy", function () {
		testClass(BaseWithProxy, "Base");
	});
	describe("Test for Inhert with Proxy", function () {
		testClass(InheritWithProxy, "Inherit");
	});
});

function testClass(Class, className) {
	it("Create Instance", function () {
		var ins = new Class();
	});
	it("Check ClassSymbolLength", function () {
		var ins = new Class();
		var length = Object.getOwnPropertySymbols(Class.prototype).length;

		length.should.be.exactly(4);
	});
	it("Check ClassSymbolType", function () {
		var ins = new Class();
		var symbols = Object.getOwnPropertySymbols(Class.prototype);

		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = symbols[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var symbol = _step.value;

				(typeof symbol === "undefined" ? "undefined" : _typeof(symbol)).should.be.exactly("symbol");
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator.return) {
					_iterator.return();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}
	});
	it("Check ClassSymbolValue", function () {
		var ins = new Class();
		var symbols = Object.getOwnPropertySymbols(Class.prototype);

		var flag = [false, false, false, false];
		var _iteratorNormalCompletion2 = true;
		var _didIteratorError2 = false;
		var _iteratorError2 = undefined;

		try {
			for (var _iterator2 = symbols[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
				var symbol = _step2.value;

				var text = typeof ins[symbol] === "function" ? ins[symbol]() : ins[symbol];
				(typeof text === "undefined" ? "undefined" : _typeof(text)).should.be.exactly("string");
				if (text === "this is private method from " + className) {
					flag[0] = true;
				} else if (text === "this is protected method from " + className) {
					flag[1] = true;
				} else if (text === "this is private field from " + className) {
					flag[2] = true;
				} else if (text === "this is protected field from " + className) {
					flag[3] = true;
				}
			}
		} catch (err) {
			_didIteratorError2 = true;
			_iteratorError2 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion2 && _iterator2.return) {
					_iterator2.return();
				}
			} finally {
				if (_didIteratorError2) {
					throw _iteratorError2;
				}
			}
		}

		flag.every(function (x) {
			return x;
		}).should.be.exactly(true);
	});
	it("Check InstanceSymbolLength", function () {
		var ins = new Class();
		var length = Object.getOwnPropertySymbols(ins).length;
		if (className === "Base") {
			length.should.be.exactly(2);
		} else if (className === "Inherit") {
			length.should.be.exactly(3);
		} else {
			throw new Error("classNameの値が不正です: " + className);
		}
	});
	it("Check InstanceSymbolType", function () {
		var ins = new Class();
		var symbols = Object.getOwnPropertySymbols(ins);

		var _iteratorNormalCompletion3 = true;
		var _didIteratorError3 = false;
		var _iteratorError3 = undefined;

		try {
			for (var _iterator3 = symbols[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
				var symbol = _step3.value;

				(typeof symbol === "undefined" ? "undefined" : _typeof(symbol)).should.be.exactly("symbol");
			}
		} catch (err) {
			_didIteratorError3 = true;
			_iteratorError3 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion3 && _iterator3.return) {
					_iterator3.return();
				}
			} finally {
				if (_didIteratorError3) {
					throw _iteratorError3;
				}
			}
		}
	});
	it("Check InstanceSymbolValue", function () {
		var ins = new Class();
		var symbols = Object.getOwnPropertySymbols(ins);

		var flag = [false, false, false];
		var _iteratorNormalCompletion4 = true;
		var _didIteratorError4 = false;
		var _iteratorError4 = undefined;

		try {
			for (var _iterator4 = symbols[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
				var symbol = _step4.value;

				var text = ins[symbol];
				(typeof text === "undefined" ? "undefined" : _typeof(text)).should.be.exactly("string");
				if (text === "this is private field from " + className) {
					flag[0] = true;
				} else if (text === "this is protected field from " + className) {
					flag[1] = true;
				} else if (className === "Inherit") {
					if (text === "this is private field from Base") {
						flag[2] = true;
					}
				} else if (className === "Base") {
					throw new Error("unknown symbol from " + className + ": " + symbol);
				}
			}
		} catch (err) {
			_didIteratorError4 = true;
			_iteratorError4 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion4 && _iterator4.return) {
					_iterator4.return();
				}
			} finally {
				if (_didIteratorError4) {
					throw _iteratorError4;
				}
			}
		}

		if (className === "Base") {
			flag[2] = true;
		}

		flag.every(function (x) {
			return x;
		}).should.be.exactly(true);
	});
}