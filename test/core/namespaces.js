module("Core - Namespaces");

test("Zart namespace", function () {
    var z = new Zart();
    
   ok(z);
   ok(z.namespaces);
   
   ok(z.namespaces.base);
   equal(typeof z.namespaces.base, "function");
   ok(z.namespaces.add);
   equal(typeof z.namespaces.add, "function");
   ok(z.namespaces.addOrReplace);
   equal(typeof z.namespaces.addOrReplace, "function");
   ok(z.namespaces.get);
   equal(typeof z.namespaces.get, "function");
   ok(z.namespaces.containsKey);
   equal(typeof z.namespaces.containsKey, "function");
   ok(z.namespaces.containsValue);
   equal(typeof z.namespaces.containsValue, "function");
   ok(z.namespaces.update);
   equal(typeof z.namespaces.update, "function");
   ok(z.namespaces.remove);
   equal(typeof z.namespaces.remove, "function");
   ok(z.namespaces.toObj);
   equal(typeof z.namespaces.toObj, "function");
   ok(z.namespaces.curie);
   equal(typeof z.namespaces.curie, "function");
   ok(z.namespaces.uri);
   equal(typeof z.namespaces.uri, "function");
   ok(z.namespaces.isCurie);
   equal(typeof z.namespaces.isCurie, "function");
   ok(z.namespaces.isUri);
   equal(typeof z.namespaces.isUri, "function");
   
});


test ("Getter/setter for base namespace", function () {
    var z = new Zart();
    
    equal(typeof z.namespaces.base(), "string");
    
    z.namespaces.base("http://this.is-a-default.namespace/");
    
    equal(z.namespaces.base(), "http://this.is-a-default.namespace/");
    
    raises(function () {
        z.namespaces.base({"test" : "http://this.should.fail/"});
    });
    
    z.namespaces.add("", "http://this.is-another-default.namespace/");
    
    equal(z.namespaces.base(), "http://this.is-another-default.namespace/");
});

test ("Manually adding namespaces", function () {
    var z = new Zart();
    
    var reference = jQuery.extend(z.namespaces.toObj(), {'test' : 'http://this.is.a/test#'});

    z.namespaces.add("test","http://this.is.a/test#");
    
    deepEqual(z.namespaces.toObj(), reference, "Manually adding namespaces.");
    strictEqual(z.namespaces.get("test"), "http://this.is.a/test#", "Manually adding namespaces.");
});

test ("Manually adding multiple namespaces", function () {
    var z = new Zart();
    
    var reference = jQuery.extend(z.namespaces.toObj(), {'test' : 'http://this.is.a/test#', "test2": "http://this.is.another/test#"});

    z.namespaces.add({
        "test": "http://this.is.a/test#",
        "test2": "http://this.is.another/test#"
    });
    
    deepEqual(z.namespaces.toObj(), reference, "Manually adding namespaces.");
    strictEqual(z.namespaces.get("test"), "http://this.is.a/test#", "Manually adding namespaces.");
    strictEqual(z.namespaces.get("test2"), "http://this.is.another/test#", "Manually adding namespaces.");
});

test ("Manually adding duplicate", function () {
    var z = new Zart();
    var reference = jQuery.extend(z.namespaces.toObj(), {'test' : 'http://this.is.a/test#'});
    z.namespaces.add("test", "http://this.is.a/test#");
    z.namespaces.add("test", "http://this.is.a/test#");
    deepEqual(z.namespaces.toObj(), reference, "Manually adding namespaces.");
    strictEqual(z.namespaces.get("test"), "http://this.is.a/test#", "Manually adding namespaces.");
});

test ("Manually adding wrong duplicate (key)", function () {
    var z = new Zart();
    z.namespaces.add("test", "http://this.is.a/test#");
    raises(function () {
        z.namespaces.add("test1", "http://this.is.a/test#");
    });
});

test ("Manually adding wrong duplicate (value)", function () {
    var z = new Zart();
    z.namespaces.add("test", "http://this.is.a/test#");
    raises(function () {
        z.namespaces.add("test", "http://this.is.another/test#");
    });
});

test ("Manually adding wrong duplicate (key) - addOrReplace", function () {
    var z = new Zart();
    z.namespaces.add("test", "http://this.is.a/test#");
    z.namespaces.addOrReplace("test1", "http://this.is.a/test#");
    
    equal(z.namespaces.get("test"), undefined);
    equal(z.namespaces.get("test1"), "http://this.is.a/test#");
});

test ("Manually adding wrong duplicate (value) - addOrReplace", function () {
    var z = new Zart();
    
    z.namespaces.add("test", "http://this.is.a/test#");
    z.namespaces.addOrReplace("test", "http://this.is.a/test2#");
    
    equal(z.namespaces.get("test"), "http://this.is.a/test2#");
    
});

test ("Manually removing namespaces", function () {
    var z = new Zart();
    z.namespaces.add("test", "http://this.is.a/test#");
    var reference = z.namespaces.toObj();
    delete reference["test"];
     
    z.namespaces.remove("test");
   
    deepEqual(z.namespaces.toObj(), reference, "Manually removing namespaces.");
    strictEqual(z.namespaces['test'], undefined, "Manually removing namespaces.");
});

test ("CURIE <-> URI", function () {

    var z = new Zart();
    z.namespaces.add("test", "http://this.is.a/test#");
    
    var uri = "<http://this.is.a/test#foo>";
    var curie = "test:foo";
    var scurie = "[test:foo]";
    
    // URI -> CURIE
    equal(z.namespaces.curie(uri), curie);
    equal(z.namespaces.curie(uri, false), z.namespaces.curie(uri));
    equal(z.namespaces.curie(uri, true), scurie);
    
    // CURIE -> URI
    equal(z.namespaces.uri(curie), uri);
    equal(z.namespaces.uri(scurie), uri);
    
    ok(z.namespaces.isUri(uri));
    ok(!z.namespaces.isUri(curie));
    ok(!z.namespaces.isUri(scurie));

    ok(!z.namespaces.isCurie(uri));
    ok(z.namespaces.isCurie(curie));
    ok(z.namespaces.isCurie(scurie));
    
});