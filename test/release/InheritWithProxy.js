"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _BaseWithProxy = require("./BaseWithProxy.js");

var _BaseWithProxy2 = _interopRequireDefault(_BaseWithProxy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// fuck import module!!!!!!!!!!
var AccessModifiers = function () {
	try {
		return require("../../release/index.min.js");
	} catch (err) {
		return require("../../debug/index.js");
	}
}();

var _AccessModifiers$crea = AccessModifiers.create(_BaseWithProxy2.default);

var _AccessModifiers$crea2 = _slicedToArray(_AccessModifiers$crea, 2);

var _ = _AccessModifiers$crea2[0];
var p = _AccessModifiers$crea2[1];

var Inherit = function (_Base) {
	_inherits(Inherit, _Base);

	function Inherit() {
		_classCallCheck(this, Inherit);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Inherit).call(this));

		_this[_.privateFieldForInherit] = "this is private field from Inherit";
		_this[p.protectedField] = "this is protected field from Inherit";
		return _this;
	}

	_createClass(Inherit, [{
		key: _.privateMethodForInherit,
		value: function value() {
			return "this is private method from Inherit";
		}
	}, {
		key: p.protectedMethod,
		value: function value() {
			var superText = _get(Object.getPrototypeOf(Inherit.prototype), p.protectedMethod, this).call(this);

			return superText.replace("Base", "Inherit");
		}
	}, {
		key: _.privatePropertyForInherit,
		set: function set(value) {
			this[_.privateFieldForInherit] = value;
		},
		get: function get() {
			return this[_.privateFieldForInherit];
		}
	}, {
		key: p.protectedProperty,
		set: function set(value) {
			this[p.protectedField] = value;
		},
		get: function get() {
			return this[p.protectedField];
		}
	}]);

	return Inherit;
}(_BaseWithProxy2.default);

AccessModifiers.register([_, p], Inherit);

exports.default = Inherit;
module.exports = exports['default'];