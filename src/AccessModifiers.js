const classMap     = new Map();
const modifiersMap = new WeakMap();

// Proxy使用時用のハンドラ
const proxyHandler = {
	set(obj,name,value){
		// Symbolもしくは__proto__以外はセットしないようにする
		if((typeof(value) !== "symbol") && (name !== "__proto__")) return;
		obj[name] = value;
	},
	get(obj,name){
		// 対象が__proto__である場合は例外的にオブジェクト参照を返す
		if(name === "__proto__"){
			return obj[name];
		}
		
		// 指定されたキーがSymbol型の場合は強制的にそれを返す
		if(typeof(name) === "symbol"){
			return obj[name];
		}
		
		// 対象となるシンボルメンバが存在したら、それを返す
		if(typeof(obj[name]) === "symbol"){
			return obj[name];
		}
		
		// 完全にメンバが存在しなければ、Symbolを新規作成する
		obj[name] = Symbol(name);
		
		return obj[name];
	},
};

class AccessModifiers{
	static create(baseClass, methodList){
		// 省略可能引数の中身をチェックする
		if(typeof(baseClass) !== "function"){
			methodList = baseClass;
			baseClass  = null;
		}
		
		// methodListが指定された場合は、それがiterableかどうかを見る
		if((typeof(methodList) !== "undefined") && (!methodList || !methodList[Symbol.iterator])){
			throw new TypeError("第一引数もしくは第二引数のmethodListにはiterableを指定してください");
		}
		
		// 登録されている基底クラスのメンバ情報を取得する
		const baseValue = classMap.get(baseClass);
		
		// 戻り値を仮定義する([0]がprivate、[1]がprotectedのスコープ)
		const modifiers = [{},{}];
		
		// methodListがある場合は、Proxyを使用せずに通常のオブジェクトとして作成する
		if(methodList){
			// 無限リスト対策として、iterableをシコシコnext連打していく
			const itr = methodList[Symbol.iterator]();
			let value,done;
			
			({value,done} = itr.next());
			if(done || !value || !value[Symbol.iterator]){
				throw new TypeError("methodListにはiterableな要素を入れてください。");
			}
			for(const name of value){
				if((typeof(name) !== "string") && (typeof(name) !== "symbol")){
					throw new TypeError("methodList[0]にはstringもしくはsymbol型の要素を入れてください。");
				}
				modifiers[0][name] = Symbol(name);
			}
			
			({value,done} = itr.next());
			if(done || !value || !value[Symbol.iterator]){
				throw new TypeError("methodListにはiterableな要素を入れてください。");
			}
			for(const name of value){
				if((typeof(name) !== "string") && (typeof(name) !== "symbol")){
					throw new TypeError("methodList[1]にはstringもしくはsymbol型の要素を入れてください。");
				}
				modifiers[1][name] = Symbol(name);
			}
		}
		// methodListが存在しない場合は、ProxyでSymbolを生成するようにする
		else{
			for(const [index,value] of modifiers.entries()){
				modifiers[index] = new Proxy(value, proxyHandler);
			}
		}
		
		for(const [index,item] of modifiers.entries()){
			const isPrivate = (index === 0);
			
			// protectedの場合は、継承元のオブジェクトSymbolも参照する必要があるため
			// prototypeチェーンで繋ぐようにする
			const protoTarget = isPrivate ? {} : ((baseValue && baseValue[1]) || {});
			//const protoTarget = isPrivate ? null : ((baseValue && baseValue[1]) || null);
			//↑こっちが本当は正しい実装なんだけど、harmony-reflectがバグ修正PRをいつまでたってもマージしないゴミだから
			//バッドノウハウだけど現状打開策として空オブジェクトを返します…
			//https://github.com/tvcutsem/harmony-reflect/pull/63
			
			setPrototypeOf(item,protoTarget);
			
			// 識別子オブジェクトであることを識別するために、WeakMapにオブジェクト参照を登録する
			// valueは、privateは1、protectedは0、それ以外は既定値になる。
			modifiersMap.set(item, +isPrivate);
		}
		
		// 作成した修飾子を返す
		return modifiers;
	}
	
	static register(modifiers, inheritClass){
		if(!modifiers || !modifiers[Symbol.iterator]){
			throw new TypeError("第一引数にはiterableを指定してください");
		}
		
		const [_,p] = modifiers;
		if(!modifiersMap.has(_) || !modifiersMap.has(p)){
			throw new TypeError("第一引数のiterableには、アクセス修飾子オブジェクトを指定してください");
		}
		if(modifiersMap.get(_) !== 1){
			throw new TypeError("第一引数のiterable[0]には、privateアクセス修飾子オブジェクトを指定してください");
		}
		if(modifiersMap.get(p) !== 0){
			throw new TypeError("第一引数のiterable[1]には、protectedアクセス修飾子オブジェクトを指定してください");
		}
		
		if(typeof(inheritClass)!=="function"){
			throw new TypeError("第二引数にはclassもしくはfunctionを指定してください");
		}
		
		// バリデーションを通ったら、クラスを登録する
		classMap.set(inheritClass, modifiers);
	}
}

// __proto__にアクセスするポリフィル
function setPrototypeOf(obj, proto){
	if(Object.setPrototypeOf) return Object.setPrototypeOf.call(Object, obj, proto);
	
	if(obj.__proto__){
		obj.__proto__ = proto;
		return obj;
	}
	
	throw new Error("__proto__もしくはObject.getPrototypeOfが使用できる環境である必要があります。");
}

export default AccessModifiers;