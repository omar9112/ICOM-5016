function Product(name, model, brand, condition, priceMethod, price, description, uid){
	this.id = "";
	this.name = name;
	this.model = model;
	this.brand = brand;
	this.condition = condition;
	this.priceMethod = priceMethod;
	this.price = price;
	this.description = description;
	this.uid = uid;
	this.toJSON = toJSON;
}
