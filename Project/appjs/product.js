function Product(title, brand, model,condition, price, description){
	this.id = "";
	this.title = title;
	this.brand = brand;
	this.model = model;
	this.condition= condition;
	this.price = price;
	this.description = description;
	this.toJSON = toJSON;
}
