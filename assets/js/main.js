/* ============================================
   罗店产业招商网 · 通用交互脚本
   功能：导航折叠、数据卡片渲染、表单校验
   ============================================ */

(function () {
  "use strict";

  var LD = window.LD_DATA || {};

  /* ---------- 移动端导航 ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }

  /* 高亮当前页导航 */
  var path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav a").forEach(function (a) {
    var href = a.getAttribute("href");
    if (href === path || (path === "" && href === "index.html")) {
      a.classList.add("active");
    }
  });

  /* ---------- 通用卡片渲染 ---------- */
  function renderCarriers(containerId, filter) {
    var box = document.getElementById(containerId);
    if (!box) return;
    var limit = parseInt(box.getAttribute("data-limit") || "0", 10);
    var list = LD.carriers || [];
    if (filter && filter !== "全部") {
      list = list.filter(function (c) { return c.type === filter; });
    }
    if (limit > 0) { list = list.slice(0, limit); }
    if (list.length === 0) {
      box.innerHTML = '<p style="color:var(--muted);grid-column:1/-1;">暂无符合条件的载体，敬请期待。</p>';
      return;
    }
    box.innerHTML = list.map(function (c) {
      var cls = c.status === "可租" ? "ok" : (c.status === "可预订" ? "hold" : "busy");
      var checked = c.status === "已租" ? "disabled" : "";
      return (
        '<div class="card carrier-card">' +
          '<span class="type-badge">' + c.type + "</span>" +
          "<h3>" + c.name + "</h3>" +
          '<div class="carrier-meta">' +
            '<span><span class="k">园区</span>' + c.park + "</span>" +
            '<span><span class="k">面积</span>' + c.area + "</span>" +
            '<span><span class="k">层高</span>' + c.height + "</span>" +
            '<span><span class="k">荷载</span>' + c.load + "</span>" +
          "</div>" +
          '<p><span class="k">适合业态</span>' + c.fit + "</p>" +
          '<div class="carrier-meta"><span><span class="k">联系人</span>' + c.contact + "</span>" +
          '<span class="carrier-status ' + cls + '">状态：' + c.status + "</span></div>" +
          '<div class="card-foot">' +
            '<span class="carrier-status ' + cls + '">' + c.status + "</span>" +
            '<a class="btn btn-primary btn-sm" href="contact.html?carrier=' + encodeURIComponent(c.name) + '" ' + checked + ">联系对接</a>" +
          "</div>" +
        "</div>"
      );
    }).join("");
  }

  function renderCompanies(containerId, filter) {
    var box = document.getElementById(containerId);
    if (!box) return;
    var limit = parseInt(box.getAttribute("data-limit") || "0", 10);
    var list = LD.companies || [];
    if (filter && filter !== "全部") {
      list = list.filter(function (c) { return c.track === filter; });
    }
    if (limit > 0) { list = list.slice(0, limit); }
    if (list.length === 0) {
      box.innerHTML = '<p style="color:var(--muted);grid-column:1/-1;">暂无该类企业，敬请期待。</p>';
      return;
    }
    box.innerHTML = list.map(function (c) {
      return (
        '<div class="card company-card">' +
          '<div class="company-logo">' + c.name.charAt(0) + "</div>" +
          "<h3>" + c.name + "</h3>" +
          '<span class="company-track">' + c.track + "</span>" +
          "<p>" + c.brief + "</p>" +
        "</div>"
      );
    }).join("");
  }

  function renderPolicies(containerId) {
    var box = document.getElementById(containerId);
    if (!box) return;
    var list = LD.policies || [];
    box.innerHTML = list.map(function (p) {
      return (
        '<div class="policy-item">' +
          "<div>" +
            '<span class="cat">' + p.cat + "</span>" +
            "<h3>" + p.name + "</h3>" +
            '<div class="applies">适用对象：' + p.applies + "</div>" +
            "<p>" + p.summary + "</p>" +
          "</div>" +
          '<div class="policy-act">' +
            '<a class="btn btn-ghost btn-sm" href="' + p.pdf + '" target="_blank" rel="noopener">下载 PDF</a>' +
            '<a class="btn btn-primary btn-sm" href="contact.html">咨询政策</a>' +
          "</div>" +
        "</div>"
      );
    }).join("");
  }

  function renderActivities(containerId, status) {
    var box = document.getElementById(containerId);
    if (!box) return;
    var limit = parseInt(box.getAttribute("data-limit") || "0", 10);
    var list = (LD.activities || []).filter(function (a) {
      if (!status) return true;
      return a.status === status;
    });
    if (limit > 0) { list = list.slice(0, limit); }
    if (list.length === 0) {
      box.innerHTML = '<p style="color:var(--muted);grid-column:1/-1;">暂无活动，敬请期待。</p>';
      return;
    }
    box.innerHTML = list.map(function (a) {
      var badgeCls = a.status === "预告" ? "upcoming" : "done";
      var badgeTxt = a.status === "预告" ? "活动预告" : "往期回顾";
      var btn = a.status === "预告"
        ? '<a class="btn btn-green btn-sm" href="contact.html?activity=' + encodeURIComponent(a.name) + '">立即报名</a>'
        : '<span class="btn btn-ghost btn-sm" style="pointer-events:none;">已结束</span>';
      return (
        '<div class="card activity-card">' +
          '<div class="activity-banner">🍵</div>' +
          '<span class="activity-badge ' + badgeCls + '">' + badgeTxt + "</span>" +
          "<h3>" + a.name + "</h3>" +
          '<div class="activity-meta">' +
            '<div class="row"><span class="tag">时间</span>' + a.time + "</div>" +
            '<div class="row"><span class="tag">地点</span>' + a.place + "</div>" +
            '<div class="row"><span class="tag">规模</span>' + a.scale + "</div>" +
            '<div class="row"><span class="tag">类型</span>' + a.type + "</div>" +
          "</div>" +
          "<p>" + a.desc + "</p>" +
          '<div style="margin-top:16px;">' + btn + "</div>" +
        "</div>"
      );
    }).join("");
  }

  function renderPolicySummary(containerId, limit) {
    var box = document.getElementById(containerId);
    if (!box) return;
    var list = (LD.policies || []).slice(0, limit || 3);
    box.innerHTML = list.map(function (p) {
      return (
        '<div class="summary-item">' +
          '<span class="cat">' + p.cat + "</span>" +
          "<h3>" + p.name + "</h3>" +
          "<p>" + p.summary + "</p>" +
          '<a href="policies.html">查看政策详情 →</a>' +
        "</div>"
      );
    }).join("");
  }

  /* ---------- 载体筛选 ---------- */
  var filterBtns = document.querySelectorAll("[data-filter]");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      renderCarriers("carrierGrid", btn.getAttribute("data-filter"));
    });
  });

  /* ---------- 企业赛道筛选 ---------- */
  var trackBtns = document.querySelectorAll("[data-track]");
  trackBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      trackBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      renderCompanies("companyGrid", btn.getAttribute("data-track"));
    });
  });

  /* ---------- 招商对接表单 ---------- */
  var form = document.getElementById("leadForm");
  if (form) {
    /* 从 URL 预填意向载体 / 活动 */
    var params = new URLSearchParams(location.search);
    var carrierParam = params.get("carrier");
    var activityParam = params.get("activity");
    var carrierSel = document.getElementById("carrier");
    /* 载体下拉选项来自数据层（后期由飞书多维表格生成） */
    if (carrierSel) {
      (LD.carriers || []).forEach(function (c) {
        var o = document.createElement("option");
        o.value = c.name;
        o.textContent = c.name;
        carrierSel.appendChild(o);
      });
    }
    if (carrierSel && carrierParam) {
      var opt = document.createElement("option");
      opt.value = carrierParam;
      opt.textContent = carrierParam;
      carrierSel.appendChild(opt);
      carrierSel.value = carrierParam;
    }
    if (activityParam) {
      var needEl = document.getElementById("demand");
      if (needEl && !needEl.value) {
        needEl.value = "报名活动：" + activityParam;
      }
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;
      ["company", "industry", "contact", "phone"].forEach(function (id) {
        var el = document.getElementById(id);
        var wrap = el.closest(".form-item");
        if (!el.value.trim()) {
          wrap.classList.add("invalid");
          valid = false;
        } else {
          wrap.classList.remove("invalid");
        }
      });
      var phoneEl = document.getElementById("phone");
      if (phoneEl && !/^1\d{10}$/.test(phoneEl.value.trim())) {
        phoneEl.closest(".form-item").classList.add("invalid");
        valid = false;
      }
      var msg = document.getElementById("formMsg");
      if (!valid) {
        msg.className = "form-msg err";
        msg.textContent = "请检查必填项（企业名称、行业、联系人、有效手机号）。";
        return;
      }
      /* 收集线索对象（当前为本地演示：数据在控制台输出）
         正式上线：将以下对象 POST 到 Cloudflare Worker，
         由 Worker 校验后写入飞书多维表格「招商线索表」。 */
      var lead = {
        company: document.getElementById("company").value.trim(),
        industry: document.getElementById("industry").value,
        carrier: carrierSel ? carrierSel.value : "",
        demand: document.getElementById("demand").value.trim(),
        contact: document.getElementById("contact").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        submitTime: new Date().toISOString(),
        status: "待跟进"
      };
      console.log("[招商线索]", JSON.stringify(lead, null, 2));
      msg.className = "form-msg ok";
      msg.textContent = "提交成功，招商顾问将尽快与您联系。";
      form.reset();
      if (carrierSel) { carrierSel.innerHTML = '<option value="">请选择（可选）</option>'; }
    });
  }

  /* ---------- 活动报名表单 ---------- */
  var actForm = document.getElementById("activityForm");
  if (actForm) {
    actForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var nameEl = document.getElementById("actName");
      var phoneEl = document.getElementById("actPhone");
      var valid = true;
      if (!nameEl.value.trim()) { nameEl.closest(".form-item").classList.add("invalid"); valid = false; }
      else { nameEl.closest(".form-item").classList.remove("invalid"); }
      if (!phoneEl.value.trim() || !/^1\d{10}$/.test(phoneEl.value.trim())) {
        phoneEl.closest(".form-item").classList.add("invalid"); valid = false;
      } else { phoneEl.closest(".form-item").classList.remove("invalid"); }
      var msg = document.getElementById("actMsg");
      if (!valid) {
        msg.className = "form-msg err";
        msg.textContent = "请填写姓名与有效手机号。";
        return;
      }
      msg.className = "form-msg ok";
      msg.textContent = "报名成功，活动前我们将与您确认。";
      actForm.reset();
    });
  }

  /* ---------- 页面数据初始化 ---------- */
  renderCarriers("carrierGrid");
  renderCompanies("companyGrid");
  renderPolicies("policyList");
  renderPolicySummary("policySummary");
  renderActivities("activityUpcoming", "预告");
  renderActivities("activityPast", "回顾");
})();
