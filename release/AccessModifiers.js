"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var classMap = new Map();
var modifiersMap = new WeakMap();

// Proxy使用時用のハンドラ
var proxyHandler = {
	set: function set(obj, name, value) {
		// Symbolもしくは__proto__以外はセットしないようにする
		if ((typeof value === "undefined" ? "undefined" : _typeof(value)) !== "symbol" && name !== "__proto__") return;
		obj[name] = value;
	},
	get: function get(obj, name) {
		// 対象が__proto__である場合は例外的にオブジェクト参照を返す
		if (name === "__proto__") {
			return obj[name];
		}

		// 指定されたキーがSymbol型の場合は強制的にそれを返す
		if ((typeof name === "undefined" ? "undefined" : _typeof(name)) === "symbol") {
			return obj[name];
		}

		// 対象となるシンボルメンバが存在したら、それを返す
		if (_typeof(obj[name]) === "symbol") {
			return obj[name];
		}

		// 完全にメンバが存在しなければ、Symbolを新規作成する
		obj[name] = Symbol(name);

		return obj[name];
	}
};

var AccessModifiers = function () {
	function AccessModifiers() {
		_classCallCheck(this, AccessModifiers);
	}

	_createClass(AccessModifiers, null, [{
		key: "create",
		value: function create(baseClass, methodList) {
			// 省略可能引数の中身をチェックする
			if (typeof baseClass !== "function") {
				methodList = baseClass;
				baseClass = null;
			}

			// methodListが指定された場合は、それがiterableかどうかを見る
			if (typeof methodList !== "undefined" && (!methodList || !methodList[Symbol.iterator])) {
				throw new TypeError("第一引数もしくは第二引数のmethodListにはiterableを指定してください");
			}

			// 登録されている基底クラスのメンバ情報を取得する
			var baseValue = classMap.get(baseClass);

			// 戻り値を仮定義する([0]がprivate、[1]がprotectedのスコープ)
			var modifiers = [{}, {}];

			// methodListがある場合は、Proxyを使用せずに通常のオブジェクトとして作成する
			if (methodList) {
				// 無限リスト対策として、iterableをシコシコnext連打していく
				var itr = methodList[Symbol.iterator]();
				var value = undefined,
				    done = undefined;

				var _itr$next = itr.next();

				value = _itr$next.value;
				done = _itr$next.done;

				if (done || !value || !value[Symbol.iterator]) {
					throw new TypeError("methodListにはiterableな要素を入れてください。");
				}
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = value[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var name = _step.value;

						if (typeof name !== "string" && (typeof name === "undefined" ? "undefined" : _typeof(name)) !== "symbol") {
							throw new TypeError("methodList[0]にはstringもしくはsymbol型の要素を入れてください。");
						}
						modifiers[0][name] = Symbol(name);
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

				var _itr$next2 = itr.next();

				value = _itr$next2.value;
				done = _itr$next2.done;

				if (done || !value || !value[Symbol.iterator]) {
					throw new TypeError("methodListにはiterableな要素を入れてください。");
				}
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = value[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var name = _step2.value;

						if (typeof name !== "string" && (typeof name === "undefined" ? "undefined" : _typeof(name)) !== "symbol") {
							throw new TypeError("methodList[1]にはstringもしくはsymbol型の要素を入れてください。");
						}
						modifiers[1][name] = Symbol(name);
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
			}
			// methodListが存在しない場合は、ProxyでSymbolを生成するようにする
			else {
					var _iteratorNormalCompletion3 = true;
					var _didIteratorError3 = false;
					var _iteratorError3 = undefined;

					try {
						for (var _iterator3 = modifiers.entries()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
							var _step3$value = _slicedToArray(_step3.value, 2);

							var index = _step3$value[0];
							var value = _step3$value[1];

							modifiers[index] = new Proxy(value, proxyHandler);
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
				}

			var _iteratorNormalCompletion4 = true;
			var _didIteratorError4 = false;
			var _iteratorError4 = undefined;

			try {
				for (var _iterator4 = modifiers.entries()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
					var _step4$value = _slicedToArray(_step4.value, 2);

					var index = _step4$value[0];
					var item = _step4$value[1];

					var isPrivate = index === 0;

					// protectedの場合は、継承元のオブジェクトSymbolも参照する必要があるため
					// prototypeチェーンで繋ぐようにする
					var protoTarget = isPrivate ? {} : baseValue && baseValue[1] || {};
					//const protoTarget = isPrivate ? null : ((baseValue && baseValue[1]) || null);
					//↑こっちが本当は正しい実装なんだけど、harmony-reflectがバグ修正PRをいつまでたってもマージしないゴミだから
					//バッドノウハウだけど現状打開策として空オブジェクトを返します…
					//https://github.com/tvcutsem/harmony-reflect/pull/63

					setPrototypeOf(item, protoTarget);

					// 識別子オブジェクトであることを識別するために、WeakMapにオブジェクト参照を登録する
					// valueは、privateは1、protectedは0、それ以外は既定値になる。
					modifiersMap.set(item, +isPrivate);
				}

				// 作成した修飾子を返す
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

			return modifiers;
		}
	}, {
		key: "register",
		value: function register(modifiers, inheritClass) {
			if (!modifiers || !modifiers[Symbol.iterator]) {
				throw new TypeError("第一引数にはiterableを指定してください");
			}

			var _modifiers = _slicedToArray(modifiers, 2);

			var _ = _modifiers[0];
			var p = _modifiers[1];

			if (!modifiersMap.has(_) || !modifiersMap.has(p)) {
				throw new TypeError("第一引数のiterableには、アクセス修飾子オブジェクトを指定してください");
			}
			if (modifiersMap.get(_) !== 1) {
				throw new TypeError("第一引数のiterable[0]には、privateアクセス修飾子オブジェクトを指定してください");
			}
			if (modifiersMap.get(p) !== 0) {
				throw new TypeError("第一引数のiterable[1]には、protectedアクセス修飾子オブジェクトを指定してください");
			}

			if (typeof inheritClass !== "function") {
				throw new TypeError("第二引数にはclassもしくはfunctionを指定してください");
			}

			// バリデーションを通ったら、クラスを登録する
			classMap.set(inheritClass, modifiers);
		}
	}]);

	return AccessModifiers;
}();

// __proto__にアクセスするポリフィル


function setPrototypeOf(obj, proto) {
	if (Object.setPrototypeOf) return Object.setPrototypeOf.call(Object, obj, proto);

	if (obj.__proto__) {
		obj.__proto__ = proto;
		return obj;
	}

	throw new Error("__proto__もしくはObject.getPrototypeOfが使用できる環境である必要があります。");
}

exports.default = AccessModifiers;
module.exports = exports['default'];