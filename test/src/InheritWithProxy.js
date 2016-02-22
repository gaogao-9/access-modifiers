// fuck import module!!!!!!!!!!
const AccessModifiers = (()=>{
	try{
		return require("../../release/index.min.js");
	}
	catch(err){
		return require("../../debug/index.js");
	}
})();

import Base from "./BaseWithProxy.js";

const [_,p] = AccessModifiers.create(Base);

class Inherit extends Base{
	constructor(){
		super();
		this[_.privateFieldForInherit] = "this is private field from Inherit";
		this[p.protectedField]         = "this is protected field from Inherit";
	}
	
	set [_.privatePropertyForInherit](value){
		this[_.privateFieldForInherit] = value;
	}
	get [_.privatePropertyForInherit](){
		return this[_.privateFieldForInherit];
	}
	
	set [p.protectedProperty](value){
		this[p.protectedField] = value;
	}
	get [p.protectedProperty](){
		return this[p.protectedField];
	}
	
	[_.privateMethodForInherit](){
		return "this is private method from Inherit";
	}
	
	[p.protectedMethod](){
		const superText = super[p.protectedMethod]();
		
		return superText.replace("Base","Inherit");
	}
}

AccessModifiers.register([_,p], Inherit);

export default Inherit;