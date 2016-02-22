"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// fuck import module!!!!!!!!!!
var AccessModifiers = function () {
	try {
		return require("../../release/index.min.js");
	} catch (err) {
		return require("../../debug/index.js");
	}
}();

var _AccessModifiers$crea = AccessModifiers.create();

var _AccessModifiers$crea2 = _slicedToArray(_AccessModifiers$crea, 2);

var _ = _AccessModifiers$crea2[0];
var p = _AccessModifiers$crea2[1];

var Base = function () {
	function Base() {
		_classCallCheck(this, Base);

		this[_.privateFieldForBase] = "this is private field from Base";
		this[p.protectedField] = "this is protected field from Base";
	}

	_createClass(Base, [{
		key: _.privateMethodForBase,
		value: function value() {
			return "this is private method from Base";
		}
	}, {
		key: p.protectedMethod,
		value: function value() {
			return "this is protected method from Base";
		}
	}, {
		key: _.privatePropertyForBase,
		set: function set(value) {
			this[_.privateFieldForBase] = value;
		},
		get: function get() {
			return this[_.privateFieldForBase];
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

	return Base;
}();

AccessModifiers.register([_, p], Base);

exports.default = Base;
module.exports = exports['default'];