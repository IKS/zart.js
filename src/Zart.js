// ### Handle dependencies
//
// Zart tries to load its dependencies automatically. 
// Please note that this autoloading functionality only works on the server.
// On browser Backbone needs to be included manually.

// Require [underscore.js](http://documentcloud.github.com/underscore/) 
// using CommonJS require if it isn't yet loaded.
//
// On node.js underscore.js can be installed via:
//
//     npm install underscore
var _ = this._;
if (!_ && (typeof require !== 'undefined')) { _ = require('underscore')._; }
if (!_) {
    throw 'Zart requires underscore.js to be available';
}

// Require [Backbone.js](http://documentcloud.github.com/backbone/) 
// using CommonJS require if it isn't yet loaded.
//
// On node.js Backbone.js can be installed via:
//
//     npm install backbone
var Backbone = this.Backbone;
if (!Backbone && (typeof require !== 'undefined')) { Backbone = require('backbone'); }
if (!Backbone) {
    throw 'Zart requires Backbone.js to be available';
}

// Require [jQuery](http://jquery.com/) using CommonJS require if it 
// isn't yet loaded.
//
// On node.js jQuery can be installed via:
//
//     npm install jquery
var jQuery = this.jQuery;
if (!jQuery && (typeof require !== 'undefined')) { jQuery = require('jquery'); }
if (!jQuery) {
    throw 'Zart requires jQuery to be available';
}

var Zart;
Zart = function (config) {
    this.config = (config) ? config : {};
    this.services = {};
    
    this.entities = new this.EntityCollection();
    this.entities.zart = this;

    this.Entity.prototype.zart = this;

    this.defaultProxyUrl = (this.config.defaultProxyUrl) ? this.config.defaultProxyUrl : "../utils/proxy/proxy.php";
    
    this.Namespaces.prototype.zart = this;
    this.namespaces = new this.Namespaces(
        (this.config.defaultNamespace) ? 
            this.config.defaultNamespace : 
            "http://ontology.zart.js/"
    );
    
    this.Type.prototype.zart = this;
    this.Types.prototype.zart = this;
    this.Attribute.prototype.zart = this;
    this.Attributes.prototype.zart = this;
    this.types = new this.Types();
    
    this.types.add("Thing");
};

Zart.prototype = {

    use: function(service, name){
        if (!name) {
            name = service.name;
        }
        service.zart = this;
        service.name = name;
        if (service.init) {
            service.init();
        }
        this.services[name] = service;
    },
    
    service: function(name){
        if (!this.services[name]) {
            throw "Undefined service " + name;
        }
        return this.services[name];
    },
    
    getServicesArray: function(){
        var res = [];
        _(this.services).each(function(service, i){
            res.push(service);
        });
        return res;
    },

    // Declaring the ..able classes
    Able : Able,
    
    // Loadable
    load: function(options){
        if (!options) {
            options = {};
        }
        options.zart = this;
        return new this.Loadable(options);
    },
    
    Loadable : function (options) {
        this.init(options,"load");
    },
    
    // Savable
    save: function(options){
        if (!options) {
            options = {};
        }
        options.zart = this;
        return new this.Savable(options);
    },
    
    Savable : function(options){
        this.init(options, "save");
    },
    
    // Removable
    remove: function(options){
        if (!options) {
            options = {};
        }
        options.zart = this;
        return new this.Removable(options);
    },
    
    Removable : function(options){
        this.init(options, "remove");
    },
    
    // Analyzable
    analyze: function(options){
        if (!options) {
            options = {};
        }
        options.zart = this;
        return new this.Analyzable(options);
    },
    
    Analyzable : function (options) {
        this.init(options, "analyze");
    },
    
    // Findable
    find: function(options){
        if (!options) {
            options = {};
        }
        options.zart = this;
        return new this.Findable(options);
    },
    
    Findable : function (options) {
        this.init(options, "find");
    }
    
};
    
Zart.prototype.Loadable.prototype = new Zart.prototype.Able();
        
Zart.prototype.Savable.prototype = new Zart.prototype.Able();
        
Zart.prototype.Removable.prototype = new Zart.prototype.Able();
    
Zart.prototype.Analyzable.prototype = new Zart.prototype.Able();

Zart.prototype.Findable.prototype = new Zart.prototype.Able();  
