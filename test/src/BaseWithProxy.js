// fuck import module!!!!!!!!!!
const AccessModifiers = (()=>{
	try{
		return require("../../release/index.min.js");
	}
	catch(err){
		return require("../../debug/index.js");
	}
})();

const [_,p] = AccessModifiers.create();

class Base{
	constructor(){
		this[_.privateFieldForBase] = "this is private field from Base";
		this[p.protectedField]      = "this is protected field from Base";
	}
	
	set [_.privatePropertyForBase](value){
		this[_.privateFieldForBase] = value;
	}
	get [_.privatePropertyForBase](){
		return this[_.privateFieldForBase];
	}
	
	set [p.protectedProperty](value){
		this[p.protectedField] = value;
	}
	get [p.protectedProperty](){
		return this[p.protectedField];
	}
	
	[_.privateMethodForBase](){
		return "this is private method from Base";
	}
	
	[p.protectedMethod](){
		return "this is protected method from Base";
	}
}

AccessModifiers.register([_,p], Base);

export default Base;