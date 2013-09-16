function Product(name, model, instantPrice, bidPrice, description){
	this.id = "";
	this.name = name;
		this.model = model;
	this.bidPrice = bidPrice;
	this.instantPrice = instantPrice;
	this.description = description;
	this.toJSON = toJSON;
}
