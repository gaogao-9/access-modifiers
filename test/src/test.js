import "babel-polyfill";
import Reflect from "harmony-reflect";
import should from "should";

// 読み込みテスト
new Promise((resolve,reject)=>{
	describe("Test Loading",()=>{
		const classObj = {};
		const promiseList = [];
		for(const name of ["Base","Inherit","BaseWithProxy","InheritWithProxy"]){
			promiseList.push(new Promise((resolve,reject)=>{
				it(`load ./${name}.js`,()=>{
					classObj[name] = require(`./${name}.js`);
					resolve();
				});
			}));
		}
		Promise.all(promiseList).then(()=>{
			resolve(classObj);
		}).catch(err=>{
			reject();
		});
	});
}).then(({Base,Inherit,BaseWithProxy,InheritWithProxy})=>{
	// Proxy使用版のテスト
	describe("Test for Base",()=>{
		testClass(Base, "Base");
	});
	describe("Test for Inherit",()=>{
		testClass(Inherit, "Inherit");
	});
	
	// Proxy不使用版のテスト
	describe("Test for Base with Proxy",()=>{
		testClass(BaseWithProxy, "Base");
	});
	describe("Test for Inhert with Proxy",()=>{
		testClass(InheritWithProxy, "Inherit");
	});
});

function testClass(Class,className){
	it("Create Instance",()=>{
		const ins = new Class();
	});
	it("Check ClassSymbolLength",()=>{
		const ins = new Class();
		const length = Object.getOwnPropertySymbols(Class.prototype).length;
		
		length.should.be.exactly(4);
	});
	it("Check ClassSymbolType",()=>{
		const ins = new Class();
		const symbols = Object.getOwnPropertySymbols(Class.prototype);
		
		for(const symbol of symbols){
			(typeof(symbol)).should.be.exactly("symbol");
		}
	});
	it("Check ClassSymbolValue",()=>{
		const ins = new Class();
		const symbols = Object.getOwnPropertySymbols(Class.prototype);
		
		const flag = [false,false,false,false];
		for(const symbol of symbols){
			const text = (typeof(ins[symbol]) === "function") ? ins[symbol]() : ins[symbol];
			(typeof(text)).should.be.exactly("string");
			if(text === `this is private method from ${className}`){
				flag[0] = true;
			}
			else if(text === `this is protected method from ${className}`){
				flag[1] = true;
			}
			else if(text === `this is private field from ${className}`){
				flag[2] = true;
			}
			else if(text === `this is protected field from ${className}`){
				flag[3] = true;
			}
		}
		
		flag.every(x=>x).should.be.exactly(true);
	});
	it("Check InstanceSymbolLength",()=>{
		const ins = new Class();
		const length = Object.getOwnPropertySymbols(ins).length;
		if(className === "Base"){
			length.should.be.exactly(2);
		}
		else if(className === "Inherit"){
			length.should.be.exactly(3);
		}
		else{
			throw new Error(`classNameの値が不正です: ${className}`);
		}
	});
	it("Check InstanceSymbolType",()=>{
		const ins = new Class();
		const symbols = Object.getOwnPropertySymbols(ins);
		
		for(const symbol of symbols){
			(typeof(symbol)).should.be.exactly("symbol");
		}
	});
	it("Check InstanceSymbolValue",()=>{
		const ins = new Class();
		const symbols = Object.getOwnPropertySymbols(ins);
		
		const flag = [false,false,false];
		for(const symbol of symbols){
			const text = ins[symbol];
			(typeof(text)).should.be.exactly("string");
			if(text === `this is private field from ${className}`){
				flag[0] = true;
			}
			else if(text === `this is protected field from ${className}`){
				flag[1] = true;
			}
			else if(className === "Inherit"){
				if(text === `this is private field from Base`){
					flag[2] = true;
				}
			}
			else if(className === "Base"){
				throw new Error(`unknown symbol from ${className}: ${symbol}`);
			}
		}
		if(className === "Base"){
			flag[2] = true;
		}
		
		flag.every(x=>x).should.be.exactly(true);
	});
}