// File:   Type.js
// Author: <a href="mailto:sebastian.germesin@dfki.de">Sebastian Germesin</a>
//

Zart.prototype.Type = function (id, attrs) {
    if (id === undefined || typeof id !== 'string') {
        throw "The type constructor needs an 'id' of type string! E.g., 'Person'";
    }

    if (this.zart.types.get(id)) {
        return this.zart.types.get(id);
    }
    
    this.id = this.zart.namespaces.isUri(id) ? id : this.zart.namespaces.uri(id);

    this.supertypes = new this.zart.Types();
    this.subtypes = new this.zart.Types();
    
    if (attrs === undefined) {
        attrs = [];
    }
    this.attributes = new this.zart.Attributes(this, attrs);
    
    this.isof = function (type) {
        type = this.zart.types.get(type);
        if (type) {
            return type.subsumes(this.id);
        } else {
            throw "No valid type given";
        }
    };
    
    this.subsumes = function (type) {
        type = this.zart.types.get(type);
        if (type) {
            if (this.id === type.id) {
                return true;
            }
            var subsumedByChildren = false;
            var subtypes = this.subtypes.list();
            for (var c = 0; c < subtypes.length; c++) {
                var childObj = subtypes[c];
                if (childObj) {
                     if (childObj.id === type.id || childObj.subsumes(type)) {
                         return true;
                     }
                }
            }
            return false;
        } else {
            throw "No valid type given";
        }
    };
    
    this.inherit = function (supertype) {
        if (typeof supertype === "string") {
            this.inherit(this.zart.types.get(supertype));
        }
        else if (supertype instanceof this.zart.Type) {
            supertype.subtypes.add(this);
            this.supertypes.add(supertype);
            try {
                // only for validation of attribute-inheritance!
                this.attributes.list();
            } catch (e) {
                supertype.subtypes.remove(this);
                this.supertypes.remove(supertype);
                throw e;
            }
        } else if (jQuery.isArray(supertype)) {
            for (var i = 0; i < supertype.length; i++) {
                this.inherit(supertype[i]);
            }
        } else {
            throw "Wrong argument in Zart.Type.inherit()";
        }
        return this;
    };
        
    this.hierarchy = function () {
        var obj = {id : this.id, subtypes: []};
        var list = this.subtypes.list();
        for (var c = 0; c < list.length; c++) {
            var childObj = this.zart.types.get(list[c]);
            obj.subtypes.push(childObj.hierarchy());
        }
        return obj;
    };
        
    this.remove = function () {
        return this.zart.types.remove(this);
    };
    
    this.toString = function () {
        return this.id;
    };
    
};

Zart.prototype.Types = function () {
        
    this._types = {};
    
    this.add = function (id, attrs) {
        if (this.get(id)) {
            throw "Type '" + id + "' already registered.";
        } 
        else {
            if (typeof id === "string") {
                var t = new this.zart.Type(id, attrs);
                this._types[t.id] = t;
                return t;
            } else if (id instanceof this.zart.Type) {
            	this._types[id.id] = id;
                return id;
            } else {
                throw "Wrong argument to Zart.Types.add()!";
            }
        }
    };
    
    this.addOrOverwrite = function(id, attrs){
        if (this.get(id)) {
            this.remove(id);
        }
        return this.add(id, attrs);
    };
    
    this.get = function (id) {
        if (!id) return undefined;
        if (typeof id === 'string') {
            var lid = this.zart.namespaces.isUri(id) ? id : this.zart.namespaces.uri(id);
            return this._types[lid];
        } else if (id instanceof this.zart.Type) {
            return this.get(id.id);
        }
        return undefined;
    };
    
    this.remove = function (id) {
        var t = this.get(id);
        if (!t) {
            return this;
        }
        delete this._types[t.id];
        
        var subtypes = t.subtypes.list();
        for (var c = 0; c < subtypes.length; c++) {
            var childObj = subtypes[c];
            if (childObj.supertypes.list().length === 1) {
                //recursively remove all children 
                //that inherit only from this type
                this.remove(childObj);
            } else {
                childObj.supertypes.remove(t.id);
            }
        }
        return t;
    };
    
    this.toArray = this.list = function () {
        var ret = [];
        for (var i in this._types) {
            ret.push(this._types[i]);
        }
        return ret;
    };
};
