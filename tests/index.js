import QUnit from "qunit"
import './home-route-fsm.specs'
import './signup-route-fsm.specs'
import './signin-route-fsm-specs'
import './editor-route-fsm-specs'
import './settings-route-fsm-specs'


QUnit.dump.maxDepth = 50;

QUnit.module("Testing QUnit", {});

QUnit.test("QUnit works", function exec_test(assert) {
  assert.ok(true)
});
