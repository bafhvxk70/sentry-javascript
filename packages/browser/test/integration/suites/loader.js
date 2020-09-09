if (IS_LOADER) {
  describe("Loader Specific Tests", function () {
    it("should add breadcrumb from onLoad callback from undefined error", function () {
      return runInSandbox(sandbox, function () {
        Beidou.onLoad(function () {
          Beidou.addBreadcrumb({
            category: "auth",
            message: "testing loader",
            level: "error",
          });
        });
        setTimeout(function () {
          Beidou.captureMessage("test");
        });
        undefinedMethod();
      }).then(function (summary) {
        if (IS_ASYNC_LOADER) {
          assert.notOk(summary.events[0].breadcrumbs);
        } else {
          if (summary.events[0].breadcrumbs) {
            assert.ok(summary.events[0].breadcrumbs);
            assert.lengthOf(summary.events[0].breadcrumbs, 1);
            assert.equal(
              summary.events[0].breadcrumbs[0].message,
              "testing loader"
            );
          } else {
            // This seems to be happening only in chrome
            assert.notOk(summary.events[0].breadcrumbs);
          }
        }
      });
    });

    it("should add breadcrumb from onLoad callback from undefined error with custom init()", function () {
      return runInSandbox(sandbox, function () {
        Beidou.onLoad(function () {
          Beidou.init({ debug: true });
          Beidou.addBreadcrumb({
            category: "auth",
            message: "testing loader",
            level: "error",
          });
        });
        setTimeout(function () {
          Beidou.captureMessage("test");
        });
        undefinedMethod(); // trigger error
      }).then(function (summary) {
        assert.ok(summary.events[0].breadcrumbs);
        assert.lengthOf(summary.events[0].breadcrumbs, 1);
        assert.equal(
          summary.events[0].breadcrumbs[0].message,
          "testing loader"
        );
      });
    });
  });
}
