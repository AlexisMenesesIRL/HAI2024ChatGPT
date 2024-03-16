var __pow = Math.pow,
    __async = (t, e, i) => new Promise(((s, r) => {
        var a = t => {
                try {
                    n(i.next(t))
                } catch (e) {
                    r(e)
                }
            },
            o = t => {
                try {
                    n(i.throw(t))
                } catch (e) {
                    r(e)
                }
            },
            n = t => t.done ? s(t.value) : Promise.resolve(t.value).then(a, o);
        n((i = i.apply(t, e)).next())
    }));
! function(t, e) {
    "object" == typeof exports && "undefined" != typeof module ? e(exports, require("@pixi/utils"), require("@pixi/math"), require("@pixi/core"), require("@pixi/display")) : "function" == typeof define && define.amd ? define(["exports", "@pixi/utils", "@pixi/math", "@pixi/core", "@pixi/display"], e) : e(((t = "undefined" != typeof globalThis ? globalThis : t || self).PIXI = t.PIXI || {}, t.PIXI.live2d = t.PIXI.live2d || {}), t.PIXI.utils, t.PIXI, t.PIXI, t.PIXI)
}(this, (function(t, e, i, s, r) {
    "use strict";
    var a, o, n;
    (o = a || (a = {})).supportMoreMaskDivisions = !0, o.setOpacityFromMotion = !1, t.config = void 0, (n = t.config || (t.config = {})).LOG_LEVEL_VERBOSE = 0, n.LOG_LEVEL_WARNING = 1, n.LOG_LEVEL_ERROR = 2, n.LOG_LEVEL_NONE = 999, n.logLevel = n.LOG_LEVEL_WARNING, n.sound = !0, n.motionSync = !0, n.motionFadingDuration = 500, n.idleMotionFadingDuration = 2e3, n.expressionFadingDuration = 500, n.preserveExpressionOnMotion = !0, n.cubism4 = a;
    const l = {
        log(e, ...i) {
            t.config.logLevel <= t.config.LOG_LEVEL_VERBOSE && console.log(`[${e}]`, ...i)
        },
        warn(e, ...i) {
            t.config.logLevel <= t.config.LOG_LEVEL_WARNING && console.warn(`[${e}]`, ...i)
        },
        error(e, ...i) {
            t.config.logLevel <= t.config.LOG_LEVEL_ERROR && console.error(`[${e}]`, ...i)
        }
    };

    function h(t, e, i) {
        return t < e ? e : t > i ? i : t
    }

    function d(t, e) {
        return Math.random() * (e - t) + t
    }

    function u(t, e, i, s, r) {
        const a = e[s];
        null !== a && typeof a === t && (i[r] = a)
    }

    function c(t, e, i, s, r) {
        const a = e[s];
        Array.isArray(a) && (i[r] = a.filter((e => null !== e && typeof e === t)))
    }

    function g(t, e) {
        e.forEach((e => {
            Object.getOwnPropertyNames(e.prototype).forEach((i => {
                "constructor" !== i && Object.defineProperty(t.prototype, i, Object.getOwnPropertyDescriptor(e.prototype, i))
            }))
        }))
    }

    function m(t) {
        let e = t.lastIndexOf("/");
        return -1 != e && (t = t.slice(0, e)), e = t.lastIndexOf("/"), -1 !== e && (t = t.slice(e + 1)), t
    }

    function p(t, e) {
        const i = t.indexOf(e); - 1 !== i && t.splice(i, 1)
    }
    class _ extends e.EventEmitter {
        constructor(t, e) {
            super(), this.expressions = [], this.reserveExpressionIndex = -1, this.destroyed = !1, this.settings = t, this.tag = `ExpressionManager(${t.name})`
        }
        init() {
            this.defaultExpression = this.createExpression({}, void 0), this.currentExpression = this.defaultExpression, this.stopAllExpressions()
        }
        loadExpression(t) {
            return __async(this, null, (function*() {
                if (!this.definitions[t]) return void l.warn(this.tag, `Undefined expression at [${t}]`);
                if (null === this.expressions[t]) return void l.warn(this.tag, `Cannot set expression at [${t}] because it's already failed in loading.`);
                if (this.expressions[t]) return this.expressions[t];
                const e = yield this._loadExpression(t);
                return this.expressions[t] = e, e
            }))
        }
        _loadExpression(t) {
            throw new Error("Not implemented.")
        }
        setRandomExpression() {
            return __async(this, null, (function*() {
                if (this.definitions.length) {
                    const t = [];
                    for (let e = 0; e < this.definitions.length; e++) null !== this.expressions[e] && this.expressions[e] !== this.currentExpression && e !== this.reserveExpressionIndex && t.push(e);
                    if (t.length) {
                        const e = Math.floor(Math.random() * t.length);
                        return this.setExpression(e)
                    }
                }
                return !1
            }))
        }
        resetExpression() {
            this._setExpression(this.defaultExpression)
        }
        restoreExpression() {
            this._setExpression(this.currentExpression)
        }
        setExpression(t) {
            return __async(this, null, (function*() {
                if ("number" != typeof t && (t = this.getExpressionIndex(t)), !(t > -1 && t < this.definitions.length)) return !1;
                if (t === this.expressions.indexOf(this.currentExpression)) return !1;
                this.reserveExpressionIndex = t;
                const e = yield this.loadExpression(t);
                return !(!e || this.reserveExpressionIndex !== t) && (this.reserveExpressionIndex = -1, this.currentExpression = e, this._setExpression(e), !0)
            }))
        }
        update(t, e) {
            return !this.isFinished() && this.updateParameters(t, e)
        }
        destroy() {
            this.destroyed = !0, this.emit("destroy");
            this.definitions = void 0, this.expressions = void 0
        }
    }
    class f {
        constructor() {
            this.targetX = 0, this.targetY = 0, this.x = 0, this.y = 0, this.vx = 0, this.vy = 0
        }
        focus(t, e, i = !1) {
            this.targetX = h(t, -1, 1), this.targetY = h(e, -1, 1), i && (this.x = this.targetX, this.y = this.targetY)
        }
        update(t) {
            const e = this.targetX - this.x,
                i = this.targetY - this.y;
            if (Math.abs(e) < .01 && Math.abs(i) < .01) return;
            const s = Math.sqrt(__pow(e, 2) + __pow(i, 2)),
                r = 5.333333333333333 / (1e3 / t);
            let a = r * (e / s) - this.vx,
                o = r * (i / s) - this.vy;
            const n = Math.sqrt(__pow(a, 2) + __pow(o, 2)),
                l = .006666666666666667 * r * t;
            n > l && (a *= l / n, o *= l / n), this.vx += a, this.vy += o;
            const h = Math.sqrt(__pow(this.vx, 2) + __pow(this.vy, 2)),
                d = .5 * (Math.sqrt(__pow(l, 2) + 8 * l * s) - l);
            h > d && (this.vx *= d / h, this.vy *= d / h), this.x += this.vx, this.y += this.vy
        }
    }
    class x {
        constructor(t) {
            this.json = t;
            let e = t.url;
            if ("string" != typeof e) throw new TypeError("The `url` field in settings JSON must be defined as a string.");
            this.url = e, this.name = m(this.url)
        }
        resolveURL(t) {
            return e.url.resolve(this.url, t)
        }
        replaceFiles(t) {
            this.moc = t(this.moc, "moc"), void 0 !== this.pose && (this.pose = t(this.pose, "pose")), void 0 !== this.physics && (this.physics = t(this.physics, "physics"));
            for (let e = 0; e < this.textures.length; e++) this.textures[e] = t(this.textures[e], `textures[${e}]`)
        }
        getDefinedFiles() {
            const t = [];
            return this.replaceFiles((e => (t.push(e), e))), t
        }
        validateFiles(t) {
            const e = (e, i) => {
                const s = this.resolveURL(e);
                if (!t.includes(s)) {
                    if (i) throw new Error(`File "${e}" is defined in settings, but doesn't exist in given files`);
                    return !1
                }
                return !0
            };
            [this.moc, ...this.textures].forEach((t => e(t, !0)));
            return this.getDefinedFiles().filter((t => e(t, !1)))
        }
    }
    var y = (t => (t[t.NONE = 0] = "NONE", t[t.IDLE = 1] = "IDLE", t[t.NORMAL = 2] = "NORMAL", t[t.FORCE = 3] = "FORCE", t))(y || {});
    class M {
        constructor() {
            this.debug = !1, this.currentPriority = 0, this.reservePriority = 0
        }
        reserve(t, e, i) {
            if (i <= 0) return l.log(this.tag, "Cannot start a motion with MotionPriority.NONE."), !1;
            if (t === this.currentGroup && e === this.currentIndex) return l.log(this.tag, "Motion is already playing.", this.dump(t, e)), !1;
            if (t === this.reservedGroup && e === this.reservedIndex || t === this.reservedIdleGroup && e === this.reservedIdleIndex) return l.log(this.tag, "Motion is already reserved.", this.dump(t, e)), !1;
            if (1 === i) {
                if (0 !== this.currentPriority) return l.log(this.tag, "Cannot start idle motion because another motion is playing.", this.dump(t, e)), !1;
                if (void 0 !== this.reservedIdleGroup) return l.log(this.tag, "Cannot start idle motion because another idle motion has reserved.", this.dump(t, e)), !1;
                this.setReservedIdle(t, e)
            } else {
                if (i < 3) {
                    if (i <= this.currentPriority) return l.log(this.tag, "Cannot start motion because another motion is playing as an equivalent or higher priority.", this.dump(t, e)), !1;
                    if (i <= this.reservePriority) return l.log(this.tag, "Cannot start motion because another motion has reserved as an equivalent or higher priority.", this.dump(t, e)), !1
                }
                this.setReserved(t, e, i)
            }
            return !0
        }
        start(t, e, i, s) {
            if (1 === s) {
                if (this.setReservedIdle(void 0, void 0), 0 !== this.currentPriority) return l.log(this.tag, "Cannot start idle motion because another motion is playing.", this.dump(e, i)), !1
            } else {
                if (e !== this.reservedGroup || i !== this.reservedIndex) return l.log(this.tag, "Cannot start motion because another motion has taken the place.", this.dump(e, i)), !1;
                this.setReserved(void 0, void 0, 0)
            }
            return !!t && (this.setCurrent(e, i, s), !0)
        }
        complete() {
            this.setCurrent(void 0, void 0, 0)
        }
        setCurrent(t, e, i) {
            this.currentPriority = i, this.currentGroup = t, this.currentIndex = e
        }
        setReserved(t, e, i) {
            this.reservePriority = i, this.reservedGroup = t, this.reservedIndex = e
        }
        setReservedIdle(t, e) {
            this.reservedIdleGroup = t, this.reservedIdleIndex = e
        }
        isActive(t, e) {
            return t === this.currentGroup && e === this.currentIndex || t === this.reservedGroup && e === this.reservedIndex || t === this.reservedIdleGroup && e === this.reservedIdleIndex
        }
        reset() {
            this.setCurrent(void 0, void 0, 0), this.setReserved(void 0, void 0, 0), this.setReservedIdle(void 0, void 0)
        }
        shouldRequestIdleMotion() {
            return void 0 === this.currentGroup && void 0 === this.reservedIdleGroup
        }
        shouldOverrideExpression() {
            return !t.config.preserveExpressionOnMotion && this.currentPriority > 1
        }
        dump(t, e) {
            if (this.debug) {
                return `\n<Requested> group = "${t}", index = ${e}\n` + ["currentPriority", "reservePriority", "currentGroup", "currentIndex", "reservedGroup", "reservedIndex", "reservedIdleGroup", "reservedIdleIndex"].map((t => "[" + t + "] " + this[t])).join("\n")
            }
            return ""
        }
    }
    class v {
        static get volume() {
            return this._volume
        }
        static set volume(t) {
            this._volume = (t > 1 ? 1 : t < 0 ? 0 : t) || 0, this.audios.forEach((t => t.volume = this._volume))
        }
        static add(t, e, i) {
            const s = new Audio(t);
            return s.volume = this._volume, s.preload = "auto", s.addEventListener("ended", (() => {
                this.dispose(s), null == e || e()
            })), s.addEventListener("error", (e => {
                this.dispose(s), l.warn("SoundManager", `Error occurred on "${t}"`, e.error), null == i || i(e.error)
            })), this.audios.push(s), s
        }
        static play(t) {
            return new Promise(((e, i) => {
                var s;
                null == (s = t.play()) || s.catch((e => {
                    t.dispatchEvent(new ErrorEvent("error", {
                        error: e
                    })), i(e)
                })), t.readyState === t.HAVE_ENOUGH_DATA ? e() : t.addEventListener("canplaythrough", e)
            }))
        }
        static dispose(t) {
            t.pause(), t.removeAttribute("src"), p(this.audios, t)
        }
        static destroy() {
            for (let t = this.audios.length - 1; t >= 0; t--) this.dispose(this.audios[t])
        }
    }
    v.audios = [], v._volume = .5;
    var P = (t => (t.ALL = "ALL", t.IDLE = "IDLE", t.NONE = "NONE", t))(P || {});
    class C extends e.EventEmitter {
        constructor(t, e) {
            super(), this.motionGroups = {}, this.state = new M, this.playing = !1, this.destroyed = !1, this.settings = t, this.tag = `MotionManager(${t.name})`, this.state.tag = this.tag
        }
        init(t) {
            (null == t ? void 0 : t.idleMotionGroup) && (this.groups.idle = t.idleMotionGroup), this.setupMotions(t), this.stopAllMotions()
        }
        setupMotions(t) {
            for (const i of Object.keys(this.definitions)) this.motionGroups[i] = [];
            let e;
            switch (null == t ? void 0 : t.motionPreload) {
                case "NONE":
                    return;
                case "ALL":
                    e = Object.keys(this.definitions);
                    break;
                default:
                    e = [this.groups.idle]
            }
            for (const i of e)
                if (this.definitions[i])
                    for (let t = 0; t < this.definitions[i].length; t++) this.loadMotion(i, t).then()
        }
        loadMotion(t, e) {
            return __async(this, null, (function*() {
                var i;
                if (!(null == (i = this.definitions[t]) ? void 0 : i[e])) return void l.warn(this.tag, `Undefined motion at "${t}"[${e}]`);
                if (null === this.motionGroups[t][e]) return void l.warn(this.tag, `Cannot start motion at "${t}"[${e}] because it's already failed in loading.`);
                if (this.motionGroups[t][e]) return this.motionGroups[t][e];
                const s = yield this._loadMotion(t, e);
                return this.destroyed ? void 0 : (this.motionGroups[t][e] = null != s ? s : null, s)
            }))
        }
        _loadMotion(t, e) {
            throw new Error("Not implemented.")
        }
        startMotion(e, i) {
            return __async(this, arguments, (function*(e, i, s = y.NORMAL) {
                var r;
                if (!this.state.reserve(e, i, s)) return !1;
                const a = null == (r = this.definitions[e]) ? void 0 : r[i];
                if (!a) return !1;
                let o;
                if (this.currentAudio && v.dispose(this.currentAudio), t.config.sound) {
                    const t = this.getSoundFile(a);
                    if (t) try {
                        o = v.add(this.settings.resolveURL(t), (() => this.currentAudio = void 0), (() => this.currentAudio = void 0)), this.currentAudio = o
                    } catch (h) {
                        l.warn(this.tag, "Failed to create audio", t, h)
                    }
                }
                const n = yield this.loadMotion(e, i);
                if (o) {
                    const e = v.play(o).catch((t => l.warn(this.tag, "Failed to play audio", o.src, t)));
                    t.config.motionSync && (yield e)
                }
                return this.state.start(n, e, i, s) ? (l.log(this.tag, "Start motion:", this.getMotionName(a)), this.emit("motionStart", e, i, o), this.state.shouldOverrideExpression() && this.expressionManager && this.expressionManager.resetExpression(), this.playing = !0, this._startMotion(n), !0) : (o && (v.dispose(o), this.currentAudio = void 0), !1)
            }))
        }
        startRandomMotion(t, e) {
            return __async(this, null, (function*() {
                const i = this.definitions[t];
                if (null == i ? void 0 : i.length) {
                    const s = [];
                    for (let e = 0; e < i.length; e++) null === this.motionGroups[t][e] || this.state.isActive(t, e) || s.push(e);
                    if (s.length) {
                        const i = Math.floor(Math.random() * s.length);
                        return this.startMotion(t, s[i], e)
                    }
                }
                return !1
            }))
        }
        stopAllMotions() {
            this._stopAllMotions(), this.state.reset(), this.currentAudio && (v.dispose(this.currentAudio), this.currentAudio = void 0)
        }
        update(t, e) {
            var i;
            return this.isFinished() && (this.playing && (this.playing = !1, this.emit("motionFinish")), this.state.shouldOverrideExpression() && (null == (i = this.expressionManager) || i.restoreExpression()), this.state.complete(), this.state.shouldRequestIdleMotion() && this.startRandomMotion(this.groups.idle, y.IDLE)), this.updateParameters(t, e)
        }
        destroy() {
            var t;
            this.destroyed = !0, this.emit("destroy"), this.stopAllMotions(), null == (t = this.expressionManager) || t.destroy();
            this.definitions = void 0, this.motionGroups = void 0
        }
    }
    const S = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    };
    class b extends e.EventEmitter {
        constructor() {
            super(...arguments), this.focusController = new f, this.originalWidth = 0, this.originalHeight = 0, this.width = 0, this.height = 0, this.localTransform = new i.Matrix, this.drawingMatrix = new i.Matrix, this.hitAreas = {}, this.textureFlipY = !1, this.viewport = [0, 0, 0, 0], this.destroyed = !1
        }
        init() {
            this.setupLayout(), this.setupHitAreas()
        }
        setupLayout() {
            const t = this,
                e = this.getSize();
            t.originalWidth = e[0], t.originalHeight = e[1];
            const i = Object.assign({
                width: 2,
                height: 2
            }, this.getLayout());
            this.localTransform.scale(i.width / 2, i.height / 2), t.width = this.originalWidth * this.localTransform.a, t.height = this.originalHeight * this.localTransform.d;
            const s = void 0 !== i.x && i.x - i.width / 2 || void 0 !== i.centerX && i.centerX || void 0 !== i.left && i.left - i.width / 2 || void 0 !== i.right && i.right + i.width / 2 || 0,
                r = void 0 !== i.y && i.y - i.height / 2 || void 0 !== i.centerY && i.centerY || void 0 !== i.top && i.top - i.height / 2 || void 0 !== i.bottom && i.bottom + i.height / 2 || 0;
            this.localTransform.translate(this.width * s, -this.height * r)
        }
        setupHitAreas() {
            const t = this.getHitAreaDefs().filter((t => t.index >= 0));
            for (const e of t) this.hitAreas[e.name] = e
        }
        hitTest(t, e) {
            return Object.keys(this.hitAreas).filter((i => this.isHit(i, t, e)))
        }
        isHit(t, e, i) {
            if (!this.hitAreas[t]) return !1;
            const s = this.hitAreas[t].index,
                r = this.getDrawableBounds(s, S);
            return r.x <= e && e <= r.x + r.width && r.y <= i && i <= r.y + r.height
        }
        getDrawableBounds(t, e) {
            const i = this.getDrawableVertices(t);
            let s = i[0],
                r = i[0],
                a = i[1],
                o = i[1];
            for (let n = 0; n < i.length; n += 2) {
                const t = i[n],
                    e = i[n + 1];
                s = Math.min(t, s), r = Math.max(t, r), a = Math.min(e, a), o = Math.max(e, o)
            }
            return null != e || (e = {}), e.x = s, e.y = a, e.width = r - s, e.height = o - a, e
        }
        updateTransform(t) {
            this.drawingMatrix.copyFrom(t).append(this.localTransform)
        }
        update(t, e) {
            this.focusController.update(t)
        }
        destroy() {
            console.log("destroying....");
            this.destroyed = !0, this.emit("destroy"), this.motionManager.destroy(), this.motionManager = void 0
        }
    }
    class I extends Error {
        constructor(t, e, i, s = !1) {
            super(t), this.url = e, this.status = i, this.aborted = s
        }
    }
    const w = class {
        static createXHR(t, e, i, s, r) {
            const a = new XMLHttpRequest;
            if (w.allXhrSet.add(a), t) {
                let e = w.xhrMap.get(t);
                e ? e.add(a) : (e = new Set([a]), w.xhrMap.set(t, e)), t.listeners("destroy").includes(w.cancelXHRs) || t.once("destroy", w.cancelXHRs)
            }
            return a.open("GET", e), a.responseType = i, a.onload = () => {
                200 !== a.status && 0 !== a.status || !a.response ? a.onerror() : s(a.response)
            }, a.onerror = () => {
                l.warn("XHRLoader", `Failed to load resource as ${a.responseType} (Status ${a.status}): ${e}`), r(new I("Network error.", e, a.status))
            }, a.onabort = () => r(new I("Aborted.", e, a.status, !0)), a.onloadend = () => {
                var e;
                w.allXhrSet.delete(a), t && (null == (e = w.xhrMap.get(t)) || e.delete(a))
            }, a
        }
        static cancelXHRs() {
            var t;
            null == (t = w.xhrMap.get(this)) || t.forEach((t => {
                t.abort(), w.allXhrSet.delete(t)
            })), w.xhrMap.delete(this)
        }
        static release() {
            w.allXhrSet.forEach((t => t.abort())), w.allXhrSet.clear(), w.xhrMap = new WeakMap
        }
    };
    let T = w;

    function L(t, e) {
        let i = -1;
        return function s(r, a) {
            if (a) return Promise.reject(a);
            if (r <= i) return Promise.reject(new Error("next() called multiple times"));
            i = r;
            const o = t[r];
            if (!o) return Promise.resolve();
            try {
                return Promise.resolve(o(e, s.bind(null, r + 1)))
            } catch (n) {
                return Promise.reject(n)
            }
        }(0)
    }
    T.xhrMap = new WeakMap, T.allXhrSet = new Set, T.loader = (t, e) => new Promise(((e, i) => {
        w.createXHR(t.target, t.settings ? t.settings.resolveURL(t.url) : t.url, t.type, (i => {
            t.result = i, e()
        }), i).send()
    }));
    class E {
        static load(t) {
            return L(this.middlewares, t).then((() => t.result))
        }
    }
    E.middlewares = [T.loader];
    const F = "Live2DFactory",
        D = (t, e) => __async(this, null, (function*() {
            if ("string" == typeof t.source) {
                const e = yield E.load({
                    url: t.source,
                    type: "json",
                    target: t.live2dModel
                });
                e.url = t.source, t.source = e, t.live2dModel.emit("settingsJSONLoaded", e)
            }
            return e()
        })),
        A = (t, e) => __async(this, null, (function*() {
            if (t.source instanceof x) return t.settings = t.source, e();
            if ("object" == typeof t.source) {
                const i = N.findRuntime(t.source);
                if (i) {
                    const s = i.createModelSettings(t.source);
                    return t.settings = s, t.live2dModel.emit("settingsLoaded", s), e()
                }
            }
            throw new TypeError("Unknown settings format.")
        })),
        B = (t, e) => {
            if (t.settings) {
                const i = N.findRuntime(t.settings);
                if (i) return i.ready().then(e)
            }
            return e()
        },
        R = (t, e) => __async(this, null, (function*() {
            yield e();
            const i = t.internalModel;
            if (i) {
                const e = t.settings,
                    s = N.findRuntime(e);
                if (s) {
                    const r = [];
                    e.pose && r.push(E.load({
                        settings: e,
                        url: e.pose,
                        type: "json",
                        target: i
                    }).then((e => {
                        i.pose = s.createPose(i.coreModel, e), t.live2dModel.emit("poseLoaded", i.pose)
                    })).catch((e => {
                        t.live2dModel.emit("poseLoadError", e), l.warn(F, "Failed to load pose.", e)
                    }))), e.physics && r.push(E.load({
                        settings: e,
                        url: e.physics,
                        type: "json",
                        target: i
                    }).then((e => {
                        i.physics = s.createPhysics(i.coreModel, e), t.live2dModel.emit("physicsLoaded", i.physics)
                    })).catch((e => {
                        t.live2dModel.emit("physicsLoadError", e), l.warn(F, "Failed to load physics.", e)
                    }))), r.length && (yield Promise.all(r))
                }
            }
        })),
        O = (t, e) => __async(this, null, (function*() {
            if (!t.settings) throw new TypeError("Missing settings.");
            {
                const i = t.live2dModel,
                    r = t.settings.textures.map((e => function(t, e = {}) {
                        const i = {
                            resourceOptions: {
                                crossorigin: e.crossOrigin
                            }
                        };
                        if (s.Texture.fromURL) return s.Texture.fromURL(t, i).catch((t => {
                            if (t instanceof Error) throw t;
                            const e = new Error("Texture loading error");
                            throw e.event = t, e
                        }));
                        i.resourceOptions.autoLoad = !1;
                        const r = s.Texture.from(t, i);
                        if (r.baseTexture.valid) return Promise.resolve(r);
                        const a = r.baseTexture.resource;
                        return null != a._live2d_load || (a._live2d_load = new Promise(((t, e) => {
                            const i = t => {
                                a.source.removeEventListener("error", i);
                                const s = new Error("Texture loading error");
                                s.event = t, e(s)
                            };
                            a.source.addEventListener("error", i), a.load().then((() => t(r))).catch(i)
                        }))), a._live2d_load
                    }(t.settings.resolveURL(e), {
                        crossOrigin: t.options.crossOrigin
                    })));
                if (yield e(), !t.internalModel) throw new TypeError("Missing internal model.");
                i.internalModel = t.internalModel, i.emit("modelLoaded", t.internalModel), i.textures = yield Promise.all(r), i.emit("textureLoaded", i.textures)
            }
        })),
        k = (t, e) => __async(this, null, (function*() {
            const i = t.settings;
            if (i instanceof x) {
                const s = N.findRuntime(i);
                if (!s) throw new TypeError("Unknown model settings.");
                const r = yield E.load({
                    settings: i,
                    url: i.moc,
                    type: "arraybuffer",
                    target: t.live2dModel
                });
                if (!s.isValidMoc(r)) throw new Error("Invalid moc data");
                const a = s.createCoreModel(r);
                return t.internalModel = s.createInternalModel(a, i, t.options), e()
            }
            throw new TypeError("Missing settings.")
        })),
        U = class {
            static registerRuntime(t) {
                U.runtimes.push(t), U.runtimes.sort(((t, e) => e.version - t.version))
            }
            static findRuntime(t) {
                for (const e of U.runtimes)
                    if (e.test(t)) return e
            }
            static setupLive2DModel(t, e, i) {
                return __async(this, null, (function*() {
                    const s = new Promise((e => t.once("textureLoaded", e))),
                        r = new Promise((e => t.once("modelLoaded", e))),
                        a = Promise.all([s, r]).then((() => t.emit("ready")));
                    yield L(U.live2DModelMiddlewares, {
                        live2dModel: t,
                        source: e,
                        options: i || {}
                    }), yield a, t.emit("load")
                }))
            }
            static loadMotion(t, e, i) {
                var s;
                const r = s => t.emit("motionLoadError", e, i, s);
                try {
                    const a = null == (s = t.definitions[e]) ? void 0 : s[i];
                    if (!a) return Promise.resolve(void 0);
                    t.listeners("destroy").includes(U.releaseTasks) || t.once("destroy", U.releaseTasks);
                    let o = U.motionTasksMap.get(t);
                    o || (o = {}, U.motionTasksMap.set(t, o));
                    let n = o[e];
                    n || (n = [], o[e] = n);
                    const h = t.getMotionFile(a);
                    return null != n[i] || (n[i] = E.load({
                        url: h,
                        settings: t.settings,
                        type: t.motionDataType,
                        target: t
                    }).then((s => {
                        var r;
                        const o = null == (r = U.motionTasksMap.get(t)) ? void 0 : r[e];
                        o && delete o[i];
                        const n = t.createMotion(s, e, a);
                        return t.emit("motionLoaded", e, i, n), n
                    })).catch((e => {
                        l.warn(t.tag, `Failed to load motion: ${h}\n`, e), r(e)
                    }))), n[i]
                } catch (a) {
                    l.warn(t.tag, `Failed to load motion at "${e}"[${i}]\n`, a), r(a)
                }
                return Promise.resolve(void 0)
            }
            static loadExpression(t, e) {
                const i = i => t.emit("expressionLoadError", e, i);
                try {
                    const s = t.definitions[e];
                    if (!s) return Promise.resolve(void 0);
                    t.listeners("destroy").includes(U.releaseTasks) || t.once("destroy", U.releaseTasks);
                    let r = U.expressionTasksMap.get(t);
                    r || (r = [], U.expressionTasksMap.set(t, r));
                    const a = t.getExpressionFile(s);
                    return null != r[e] || (r[e] = E.load({
                        url: a,
                        settings: t.settings,
                        type: "json",
                        target: t
                    }).then((i => {
                        const r = U.expressionTasksMap.get(t);
                        r && delete r[e];
                        const a = t.createExpression(i, s);
                        return t.emit("expressionLoaded", e, a), a
                    })).catch((e => {
                        l.warn(t.tag, `Failed to load expression: ${a}\n`, e), i(e)
                    }))), r[e]
                } catch (s) {
                    l.warn(t.tag, `Failed to load expression at [${e}]\n`, s), i(s)
                }
                return Promise.resolve(void 0)
            }
            static releaseTasks() {
                this instanceof C ? U.motionTasksMap.delete(this) : U.expressionTasksMap.delete(this)
            }
        };
    let N = U;
    N.runtimes = [], N.urlToJSON = D, N.jsonToSettings = A, N.waitUntilReady = B, N.setupOptionals = R, N.setupEssentials = O, N.createInternalModel = k, N.live2DModelMiddlewares = [D, A, B, R, O, k], N.motionTasksMap = new WeakMap, N.expressionTasksMap = new WeakMap, C.prototype._loadMotion = function(t, e) {
        return N.loadMotion(this, t, e)
    }, _.prototype._loadExpression = function(t) {
        return N.loadExpression(this, t)
    };
    class V {
        constructor() {
            this._autoInteract = !1
        }
        get autoInteract() {
            return this._autoInteract
        }
        set autoInteract(t) {
            t !== this._autoInteract && (t ? this.on("pointertap", G, this) : this.off("pointertap", G, this), this._autoInteract = t)
        }
        registerInteraction(t) {
            t !== this.interactionManager && (this.unregisterInteraction(), this._autoInteract && t && (this.interactionManager = t, t.on("pointermove", j, this)))
        }
        unregisterInteraction() {
            var t;
            this.interactionManager && (null == (t = this.interactionManager) || t.off("pointermove", j, this), this.interactionManager = void 0)
        }
    }

    function G(t) {
        this.tap(t.data.global.x, t.data.global.y)
    }

    function j(t) {
        this.focus(t.data.global.x, t.data.global.y)
    }
    class X extends i.Transform {}
    const z = new i.Point,
        W = new i.Matrix;
    let Y;
    class H extends r.Container {
        constructor(t) {
            super(), this.tag = "Live2DModel(uninitialized)", this.textures = [], this.transform = new X, this.anchor = new i.ObservablePoint(this.onAnchorChange, this, 0, 0), this.glContextID = -1, this.elapsedTime = performance.now(), this.deltaTime = 0, this._autoUpdate = !1, this.once("modelLoaded", (() => this.init(t)))
        }
        static from(t, e) {
            const i = new this(e);
            return N.setupLive2DModel(i, t, e).then((() => i))
        }
        static fromSync(t, e) {
            const i = new this(e);
            return N.setupLive2DModel(i, t, e).then(null == e ? void 0 : e.onLoad).catch(null == e ? void 0 : e.onError), i
        }
        static registerTicker(t) {
            Y = t
        }
        get autoUpdate() {
            return this._autoUpdate
        }
        set autoUpdate(t) {
            var e;
            Y || (Y = null == (e = window.PIXI) ? void 0 : e.Ticker), t ? this._destroyed || (Y ? (Y.shared.add(this.onTickerUpdate, this), this._autoUpdate = !0) : l.warn(this.tag, "No Ticker registered, please call Live2DModel.registerTicker(Ticker).")) : (null == Y || Y.shared.remove(this.onTickerUpdate, this), this._autoUpdate = !1)
        }
        init(t) {
            this.tag = `Live2DModel(${this.internalModel.settings.name})`;
            const e = Object.assign({
                autoUpdate: !0,
                autoInteract: !0
            }, t);
            e.autoInteract && (this.interactive = !0), this.autoInteract = e.autoInteract, this.autoUpdate = e.autoUpdate
        }
        onAnchorChange() {
            this.pivot.set(this.anchor.x * this.internalModel.width, this.anchor.y * this.internalModel.height)
        }
        motion(t, e, i) {
            return void 0 === e ? this.internalModel.motionManager.startRandomMotion(t, i) : this.internalModel.motionManager.startMotion(t, e, i)
        }
        expression(t) {
            return this.internalModel.motionManager.expressionManager ? void 0 === t ? this.internalModel.motionManager.expressionManager.setRandomExpression() : this.internalModel.motionManager.expressionManager.setExpression(t) : Promise.resolve(!1)
        }
        focus(t, e, i = !1) {
            z.x = t, z.y = e, this.toModelPosition(z, z, !0);
            let s = z.x / this.internalModel.originalWidth * 2 - 1,
                r = z.y / this.internalModel.originalHeight * 2 - 1,
                a = Math.atan2(r, s);
            this.internalModel.focusController.focus(Math.cos(a), -Math.sin(a), i)
        }
        tap(t, e) {
            const i = this.hitTest(t, e);
            i.length && (l.log(this.tag, "Hit", i), this.emit("hit", i))
        }
        hitTest(t, e) {
            return z.x = t, z.y = e, this.toModelPosition(z, z), this.internalModel.hitTest(z.x, z.y)
        }
        toModelPosition(t, e = t.clone(), i) {
            return i || (this._recursivePostUpdateTransform(), this.parent ? this.displayObjectUpdateTransform() : (this.parent = this._tempDisplayObjectParent, this.displayObjectUpdateTransform(), this.parent = null)), this.transform.worldTransform.applyInverse(t, e), this.internalModel.localTransform.applyInverse(e, e), e
        }
        containsPoint(t) {
            return this.getBounds(!0).contains(t.x, t.y)
        }
        _calculateBounds() {
            this._bounds.addFrame(this.transform, 0, 0, this.internalModel.width, this.internalModel.height)
        }
        onTickerUpdate() {
            this.update(Y.shared.deltaMS)
        }
        update(t) {
            this.deltaTime += t, this.elapsedTime += t
        }
        _render(t) {
            this.registerInteraction(t.plugins.interaction), t.batch.reset(), t.geometry.reset(), t.shader.reset(), t.state.reset();
            let e = !1;
            this.glContextID !== t.CONTEXT_UID && (this.glContextID = t.CONTEXT_UID, this.internalModel.updateWebGLContext(t.gl, this.glContextID), e = !0);
            for (let r = 0; r < this.textures.length; r++) {
                const i = this.textures[r];
                i.valid && (!e && i.baseTexture._glTextures[this.glContextID] || (t.gl.pixelStorei(WebGLRenderingContext.UNPACK_FLIP_Y_WEBGL, this.internalModel.textureFlipY), t.texture.bind(i.baseTexture, 0)), this.internalModel.bindTexture(r, i.baseTexture._glTextures[this.glContextID].texture), i.baseTexture.touched = t.textureGC.count)
            }
            const i = t.framebuffer.viewport;
            this.internalModel.viewport = [i.x, i.y, i.width, i.height], this.deltaTime && (this.internalModel.update(this.deltaTime, this.elapsedTime), this.deltaTime = 0);
            const s = W.copyFrom(t.globalUniforms.uniforms.projectionMatrix).append(this.worldTransform);
            this.internalModel.updateTransform(s), this.internalModel.draw(t.gl), t.state.reset(), t.texture.reset()
        }
        destroy(t) {
            this.emit("destroy"), this.autoUpdate = !1, this.unregisterInteraction(), (null == t ? void 0 : t.texture) && this.textures.forEach((e => e.destroy(t.baseTexture))), this.internalModel.destroy(), super.destroy(t)
        }
    }
    g(H, [V]);
    const q = class {
        static resolveURL(t, e) {
            var i;
            const s = null == (i = q.filesMap[t]) ? void 0 : i[e];
            if (void 0 === s) throw new Error("Cannot find this file from uploaded files: " + e);
            return s
        }
        static upload(t, i) {
            return __async(this, null, (function*() {
                const s = {};
                for (const r of i.getDefinedFiles()) {
                    const a = decodeURI(e.url.resolve(i.url, r)),
                        o = t.find((t => t.webkitRelativePath === a));
                    o && (s[r] = URL.createObjectURL(o))
                }
                q.filesMap[i._objectURL] = s
            }))
        }
        static createSettings(t) {
            return __async(this, null, (function*() {
                const e = t.find((t => t.name.endsWith("model.json") || t.name.endsWith("model3.json")));
                if (!e) throw new TypeError("Settings file not found");
                const i = yield q.readText(e), s = JSON.parse(i);
                s.url = e.webkitRelativePath;
                const r = N.findRuntime(s);
                if (!r) throw new Error("Unknown settings JSON");
                const a = r.createModelSettings(s);
                return a._objectURL = URL.createObjectURL(e), a
            }))
        }
        static readText(t) {
            return __async(this, null, (function*() {
                return new Promise(((e, i) => {
                    const s = new FileReader;
                    s.onload = () => e(s.result), s.onerror = i, s.readAsText(t, "utf8")
                }))
            }))
        }
    };
    let $ = q;
    $.filesMap = {}, $.factory = (t, e) => __async(this, null, (function*() {
        if (Array.isArray(t.source) && t.source[0] instanceof File) {
            const e = t.source;
            let i = e.settings;
            if (i) {
                if (!i._objectURL) throw new Error('"_objectURL" must be specified in ModelSettings')
            } else i = yield q.createSettings(e);
            i.validateFiles(e.map((t => encodeURI(t.webkitRelativePath)))), yield q.upload(e, i), i.resolveURL = function(t) {
                return q.resolveURL(this._objectURL, t)
            }, t.source = i, t.live2dModel.once("modelLoaded", (t => {
                t.once("destroy", (function() {
                    const t = this.settings._objectURL;
                    if (URL.revokeObjectURL(t), q.filesMap[t])
                        for (const e of Object.values(q.filesMap[t])) URL.revokeObjectURL(e);
                    delete q.filesMap[t]
                }))
            }))
        }
        return e()
    })), N.live2DModelMiddlewares.unshift($.factory);
    const Z = class {
        static unzip(t, i) {
            return __async(this, null, (function*() {
                const s = yield Z.getFilePaths(t), r = [];
                for (const t of i.getDefinedFiles()) {
                    const a = decodeURI(e.url.resolve(i.url, t));
                    s.includes(a) && r.push(a)
                }
                const a = yield Z.getFiles(t, r);
                for (let t = 0; t < a.length; t++) {
                    const e = r[t],
                        i = a[t];
                    Object.defineProperty(i, "webkitRelativePath", {
                        value: e
                    })
                }
                return a
            }))
        }
        static createSettings(t) {
            return __async(this, null, (function*() {
                const e = (yield Z.getFilePaths(t)).find((t => t.endsWith("model.json") || t.endsWith("model3.json")));
                if (!e) throw new Error("Settings file not found");
                const i = yield Z.readText(t, e);
                if (!i) throw new Error("Empty settings file: " + e);
                const s = JSON.parse(i);
                s.url = e;
                const r = N.findRuntime(s);
                if (!r) throw new Error("Unknown settings JSON");
                return r.createModelSettings(s)
            }))
        }
        static zipReader(t, e) {
            return __async(this, null, (function*() {
                throw new Error("Not implemented")
            }))
        }
        static getFilePaths(t) {
            return __async(this, null, (function*() {
                throw new Error("Not implemented")
            }))
        }
        static getFiles(t, e) {
            return __async(this, null, (function*() {
                throw new Error("Not implemented")
            }))
        }
        static readText(t, e) {
            return __async(this, null, (function*() {
                throw new Error("Not implemented")
            }))
        }
        static releaseReader(t) {}
    };
    let J = Z;
    if (J.ZIP_PROTOCOL = "zip://", J.uid = 0, J.factory = (t, e) => __async(this, null, (function*() {
            const i = t.source;
            let s, r, a;
            if ("string" == typeof i && (i.endsWith(".zip") || i.startsWith(Z.ZIP_PROTOCOL)) ? (s = i.startsWith(Z.ZIP_PROTOCOL) ? i.slice(Z.ZIP_PROTOCOL.length) : i, r = yield E.load({
                    url: s,
                    type: "blob",
                    target: t.live2dModel
                })) : Array.isArray(i) && 1 === i.length && i[0] instanceof File && i[0].name.endsWith(".zip") && (r = i[0], s = URL.createObjectURL(r), a = i.settings), r) {
                if (!r.size) throw new Error("Empty zip file");
                const e = yield Z.zipReader(r, s);
                a || (a = yield Z.createSettings(e)), a._objectURL = Z.ZIP_PROTOCOL + Z.uid + "/" + a.url;
                const i = yield Z.unzip(e, a);
                i.settings = a, t.source = i, s.startsWith("blob:") && t.live2dModel.once("modelLoaded", (t => {
                    t.once("destroy", (function() {
                        URL.revokeObjectURL(s)
                    }))
                })), Z.releaseReader(e)
            }
            return e()
        })), N.live2DModelMiddlewares.unshift(J.factory), !window.Live2D) throw new Error("Could not find Cubism 2 runtime. This plugin requires live2d.min.js to be loaded.");
    const Q = Live2DMotion.prototype.updateParam;
    Live2DMotion.prototype.updateParam = function(t, e) {
        Q.call(this, t, e), e.isFinished() && this.onFinishHandler && (this.onFinishHandler(this), delete this.onFinishHandler)
    };
    class K extends AMotion {
        constructor(e) {
            super(), this.params = [], this.setFadeIn(e.fade_in > 0 ? e.fade_in : t.config.expressionFadingDuration), this.setFadeOut(e.fade_out > 0 ? e.fade_out : t.config.expressionFadingDuration), Array.isArray(e.params) && e.params.forEach((t => {
                const e = t.calc || "add";
                if ("add" === e) {
                    const e = t.def || 0;
                    t.val -= e
                } else if ("mult" === e) {
                    const e = t.def || 1;
                    t.val /= e
                }
                this.params.push({
                    calc: e,
                    val: t.val,
                    id: t.id
                })
            }))
        }
        updateParamExe(t, e, i, s) {
            this.params.forEach((e => {
                t.setParamFloat(e.id, e.val * i)
            }))
        }
    }
    class tt extends _ {
        constructor(t, e) {
            var i;
            super(t, e), this.queueManager = new MotionQueueManager, this.definitions = null != (i = this.settings.expressions) ? i : [], this.init()
        }
        isFinished() {
            return this.queueManager.isFinished()
        }
        getExpressionIndex(t) {
            return this.definitions.findIndex((e => e.name === t))
        }
        getExpressionFile(t) {
            return t.file
        }
        createExpression(t, e) {
            return new K(t)
        }
        _setExpression(t) {
            return this.queueManager.startMotion(t)
        }
        stopAllExpressions() {
            this.queueManager.stopAllMotions()
        }
        updateParameters(t, e) {
            return this.queueManager.updateParam(t)
        }
    }
    class et extends C {
        constructor(t, e) {
            super(t, e), this.groups = {
                idle: "idle"
            }, this.motionDataType = "arraybuffer", this.queueManager = new MotionQueueManager, this.definitions = this.settings.motions, this.init(e)
        }
        init(t) {
            super.init(t), this.settings.expressions && (this.expressionManager = new tt(this.settings, t))
        }
        isFinished() {
            return this.queueManager.isFinished()
        }
        createMotion(e, i, s) {
            const r = Live2DMotion.loadMotion(e),
                a = i === this.groups.idle ? t.config.idleMotionFadingDuration : t.config.motionFadingDuration;
            return r.setFadeIn(s.fade_in > 0 ? s.fade_in : a), r.setFadeOut(s.fade_out > 0 ? s.fade_out : a), r
        }
        getMotionFile(t) {
            return t.file
        }
        getMotionName(t) {
            return t.file
        }
        getSoundFile(t) {
            return t.sound
        }
        _startMotion(t, e) {
            return t.onFinishHandler = e, this.queueManager.stopAllMotions(), this.queueManager.startMotion(t)
        }
        _stopAllMotions() {
            this.queueManager.stopAllMotions()
        }
        updateParameters(t, e) {
            return this.queueManager.updateParam(t)
        }
        destroy() {
            super.destroy(), this.queueManager = void 0
        }
    }
    class it {
        constructor(t) {
            this.coreModel = t, this.blinkInterval = 4e3, this.closingDuration = 100, this.closedDuration = 50, this.openingDuration = 150, this.eyeState = 0, this.eyeParamValue = 1, this.closedTimer = 0, this.nextBlinkTimeLeft = this.blinkInterval, this.leftParam = t.getParamIndex("PARAM_EYE_L_OPEN"), this.rightParam = t.getParamIndex("PARAM_EYE_R_OPEN")
        }
        setEyeParams(t) {
            this.eyeParamValue = h(t, 0, 1), this.coreModel.setParamFloat(this.leftParam, this.eyeParamValue), this.coreModel.setParamFloat(this.rightParam, this.eyeParamValue)
        }
        update(t) {
            switch (this.eyeState) {
                case 0:
                    this.nextBlinkTimeLeft -= t, this.nextBlinkTimeLeft < 0 && (this.eyeState = 1, this.nextBlinkTimeLeft = this.blinkInterval + this.closingDuration + this.closedDuration + this.openingDuration + d(0, 2e3));
                    break;
                case 1:
                    this.setEyeParams(this.eyeParamValue + t / this.closingDuration), this.eyeParamValue <= 0 && (this.eyeState = 2, this.closedTimer = 0);
                    break;
                case 2:
                    this.closedTimer += t, this.closedTimer >= this.closedDuration && (this.eyeState = 3);
                    break;
                case 3:
                    this.setEyeParams(this.eyeParamValue + t / this.openingDuration), this.eyeParamValue >= 1 && (this.eyeState = 0)
            }
        }
    }
    const st = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    class rt extends b {
        constructor(t, e, i) {
            super(), this.textureFlipY = !0, this.drawDataCount = 0, this.disableCulling = !1, this.coreModel = t, this.settings = e, this.motionManager = new et(e, i), this.eyeBlink = new it(t), this.eyeballXParamIndex = t.getParamIndex("PARAM_EYE_BALL_X"), this.eyeballYParamIndex = t.getParamIndex("PARAM_EYE_BALL_Y"), this.angleXParamIndex = t.getParamIndex("PARAM_ANGLE_X"), this.angleYParamIndex = t.getParamIndex("PARAM_ANGLE_Y"), this.angleZParamIndex = t.getParamIndex("PARAM_ANGLE_Z"), this.bodyAngleXParamIndex = t.getParamIndex("PARAM_BODY_ANGLE_X"), this.breathParamIndex = t.getParamIndex("PARAM_BREATH"), this.init()
        }
        init() {
            super.init(), this.settings.initParams && this.settings.initParams.forEach((({
                id: t,
                value: e
            }) => this.coreModel.setParamFloat(t, e))), this.settings.initOpacities && this.settings.initOpacities.forEach((({
                id: t,
                value: e
            }) => this.coreModel.setPartsOpacity(t, e))), this.coreModel.saveParam();
            const t = this.coreModel.getModelContext()._$aS;
            (null == t ? void 0 : t.length) && (this.drawDataCount = t.length);
            let e = this.coreModel.drawParamWebGL.culling;
            Object.defineProperty(this.coreModel.drawParamWebGL, "culling", {
                set: t => e = t,
                get: () => !this.disableCulling && e
            });
            const i = this.coreModel.getModelContext().clipManager,
                s = i.setupClip;
            i.setupClip = (t, e) => {
                s.call(i, t, e), e.gl.viewport(...this.viewport)
            }
        }
        getSize() {
            return [this.coreModel.getCanvasWidth(), this.coreModel.getCanvasHeight()]
        }
        getLayout() {
            const t = {};
            if (this.settings.layout)
                for (const e of Object.keys(this.settings.layout)) {
                    let i = e;
                    "center_x" === e ? i = "centerX" : "center_y" === e && (i = "centerY"), t[i] = this.settings.layout[e]
                }
            return t
        }
        updateWebGLContext(t, e) {
            const i = this.coreModel.drawParamWebGL;
            i.firstDraw = !0, i.setGL(t), i.glno = e;
            for (const a in i) i.hasOwnProperty(a) && i[a] instanceof WebGLBuffer && (i[a] = null);
            const s = this.coreModel.getModelContext().clipManager;
            s.curFrameNo = e;
            const r = t.getParameter(t.FRAMEBUFFER_BINDING);
            s.getMaskRenderTexture(), t.bindFramebuffer(t.FRAMEBUFFER, r)
        }
        bindTexture(t, e) {
            this.coreModel.setTexture(t, e)
        }
        getHitAreaDefs() {
            var t;
            return (null == (t = this.settings.hitAreas) ? void 0 : t.map((t => ({
                id: t.id,
                name: t.name,
                index: this.coreModel.getDrawDataIndex(t.id)
            })))) || []
        }
        getDrawableIDs() {
            const t = this.coreModel.getModelContext(),
                e = [];
            for (let i = 0; i < this.drawDataCount; i++) {
                const s = t.getDrawData(i);
                s && e.push(s.getDrawDataID().id)
            }
            return e
        }
        getDrawableIndex(t) {
            return this.coreModel.getDrawDataIndex(t)
        }
        getDrawableVertices(t) {
            if ("string" == typeof t && -1 === (t = this.coreModel.getDrawDataIndex(t))) throw new TypeError("Unable to find drawable ID: " + t);
            return this.coreModel.getTransformedPoints(t).slice()
        }
        update(t, e) {
            console.log(t,e);
            var i, s, r, a;
            super.update(t, e);
            const o = this.coreModel;
            this.emit("beforeMotionUpdate");
            const n = this.motionManager.update(this.coreModel, e);
            this.emit("afterMotionUpdate"), o.saveParam(), null == (i = this.motionManager.expressionManager) || i.update(o, e), n || null == (s = this.eyeBlink) || s.update(t), this.updateFocus(), this.updateNaturalMovements(t, e), null == (r = this.physics) || r.update(e), null == (a = this.pose) || a.update(t), this.emit("beforeModelUpdate"), o.update(), o.loadParam()
        }
        updateFocus() {
            this.coreModel.addToParamFloat(this.eyeballXParamIndex, this.focusController.x), this.coreModel.addToParamFloat(this.eyeballYParamIndex, this.focusController.y), this.coreModel.addToParamFloat(this.angleXParamIndex, 30 * this.focusController.x), this.coreModel.addToParamFloat(this.angleYParamIndex, 30 * this.focusController.y), this.coreModel.addToParamFloat(this.angleZParamIndex, this.focusController.x * this.focusController.y * -30), this.coreModel.addToParamFloat(this.bodyAngleXParamIndex, 10 * this.focusController.x)
        }
        updateNaturalMovements(t, e) {
            const i = e / 1e3 * 2 * Math.PI;
            this.coreModel.addToParamFloat(this.angleXParamIndex, 15 * Math.sin(i / 6.5345) * .5), this.coreModel.addToParamFloat(this.angleYParamIndex, 8 * Math.sin(i / 3.5345) * .5), this.coreModel.addToParamFloat(this.angleZParamIndex, 10 * Math.sin(i / 5.5345) * .5), this.coreModel.addToParamFloat(this.bodyAngleXParamIndex, 4 * Math.sin(i / 15.5345) * .5), this.coreModel.setParamFloat(this.breathParamIndex, .5 + .5 * Math.sin(i / 3.2345))
        }
        draw(t) {
            const e = this.disableCulling;
            t.getParameter(t.FRAMEBUFFER_BINDING) && (this.disableCulling = !0);
            const i = this.drawingMatrix;
            st[0] = i.a, st[1] = i.b, st[4] = i.c, st[5] = i.d, st[12] = i.tx, st[13] = i.ty, this.coreModel.setMatrix(st), this.coreModel.draw(), this.disableCulling = e
        }
        destroy() {
            super.destroy(), this.coreModel = void 0
        }
    }
    class at extends x {
        constructor(t) {
            if (super(t), this.motions = {}, !at.isValidJSON(t)) throw new TypeError("Invalid JSON.");
            this.moc = t.model, c("string", t, this, "textures", "textures"), this.copy(t)
        }
        static isValidJSON(t) {
            var e;
            return !!t && "string" == typeof t.model && (null == (e = t.textures) ? void 0 : e.length) > 0 && t.textures.every((t => "string" == typeof t))
        }
        copy(t) {
            u("string", t, this, "name", "name"), u("string", t, this, "pose", "pose"), u("string", t, this, "physics", "physics"), u("object", t, this, "layout", "layout"), u("object", t, this, "motions", "motions"), c("object", t, this, "hit_areas", "hitAreas"), c("object", t, this, "expressions", "expressions"), c("object", t, this, "init_params", "initParams"), c("object", t, this, "init_opacities", "initOpacities")
        }
        replaceFiles(t) {
            super.replaceFiles(t);
            for (const [e, i] of Object.entries(this.motions))
                for (let s = 0; s < i.length; s++) i[s].file = t(i[s].file, `motions.${e}[${s}].file`), void 0 !== i[s].sound && (i[s].sound = t(i[s].sound, `motions.${e}[${s}].sound`));
            if (this.expressions)
                for (let e = 0; e < this.expressions.length; e++) this.expressions[e].file = t(this.expressions[e].file, `expressions[${e}].file`)
        }
    }
    const ot = {
            x: PhysicsHair.Src.SRC_TO_X,
            y: PhysicsHair.Src.SRC_TO_Y,
            angle: PhysicsHair.Src.SRC_TO_G_ANGLE
        },
        nt = {
            x: PhysicsHair.Src.SRC_TO_X,
            y: PhysicsHair.Src.SRC_TO_Y,
            angle: PhysicsHair.Src.SRC_TO_G_ANGLE
        };
    class lt {
        constructor(t, e) {
            this.coreModel = t, this.physicsHairs = [], e.physics_hair && (this.physicsHairs = e.physics_hair.map((t => {
                const e = new PhysicsHair;
                return e.setup(t.setup.length, t.setup.regist, t.setup.mass), t.src.forEach((({
                    id: t,
                    ptype: i,
                    scale: s,
                    weight: r
                }) => {
                    const a = ot[i];
                    a && e.addSrcParam(a, t, s, r)
                })), t.targets.forEach((({
                    id: t,
                    ptype: i,
                    scale: s,
                    weight: r
                }) => {
                    const a = nt[i];
                    a && e.addTargetParam(a, t, s, r)
                })), e
            })))
        }
        update(t) {
            this.physicsHairs.forEach((e => e.update(this.coreModel, t)))
        }
    }
    class ht {
        constructor(t) {
            this.id = t, this.paramIndex = -1, this.partsIndex = -1, this.link = []
        }
        initIndex(t) {
            this.paramIndex = t.getParamIndex("VISIBLE:" + this.id), this.partsIndex = t.getPartsDataIndex(PartsDataID.getID(this.id)), t.setParamFloat(this.paramIndex, 1)
        }
    }
    class dt {
        constructor(t, e) {
            this.coreModel = t, this.opacityAnimDuration = 500, this.partsGroups = [], e.parts_visible && (this.partsGroups = e.parts_visible.map((({
                group: t
            }) => t.map((({
                id: t,
                link: e
            }) => {
                const i = new ht(t);
                return e && (i.link = e.map((t => new ht(t)))), i
            })))), this.init())
        }
        init() {
            this.partsGroups.forEach((t => {
                t.forEach((t => {
                    if (t.initIndex(this.coreModel), t.paramIndex >= 0) {
                        const e = 0 !== this.coreModel.getParamFloat(t.paramIndex);
                        this.coreModel.setPartsOpacity(t.partsIndex, e ? 1 : 0), this.coreModel.setParamFloat(t.paramIndex, e ? 1 : 0), t.link.length > 0 && t.link.forEach((t => t.initIndex(this.coreModel)))
                    }
                }))
            }))
        }
        normalizePartsOpacityGroup(t, e) {
            const i = this.coreModel,
                s = .5;
            let r = 1,
                a = t.findIndex((({
                    paramIndex: t,
                    partsIndex: e
                }) => e >= 0 && 0 !== i.getParamFloat(t)));
            if (a >= 0) {
                const s = i.getPartsOpacity(t[a].partsIndex);
                r = h(s + e / this.opacityAnimDuration, 0, 1)
            } else a = 0, r = 1;
            t.forEach((({
                partsIndex: t
            }, e) => {
                if (t >= 0)
                    if (a == e) i.setPartsOpacity(t, r);
                    else {
                        let e, a = i.getPartsOpacity(t);
                        e = r < s ? -.5 * r / s + 1 : (1 - r) * s / .5, (1 - e) * (1 - r) > .15 && (e = 1 - .15 / (1 - r)), a > e && (a = e), i.setPartsOpacity(t, a)
                    }
            }))
        }
        copyOpacity(t) {
            const e = this.coreModel;
            t.forEach((({
                partsIndex: t,
                link: i
            }) => {
                if (t >= 0 && i) {
                    const s = e.getPartsOpacity(t);
                    i.forEach((({
                        partsIndex: t
                    }) => {
                        t >= 0 && e.setPartsOpacity(t, s)
                    }))
                }
            }))
        }
        update(t) {
            this.partsGroups.forEach((e => {
                this.normalizePartsOpacityGroup(e, t), this.copyOpacity(e)
            }))
        }
    }
    if (N.registerRuntime({
            version: 2,
            test: t => t instanceof at || at.isValidJSON(t),
            ready: () => Promise.resolve(),
            isValidMoc(t) {
                if (t.byteLength < 3) return !1;
                const e = new Int8Array(t, 0, 3);
                return "moc" === String.fromCharCode(...e)
            },
            createModelSettings: t => new at(t),
            createCoreModel(t) {
                const e = Live2DModelWebGL.loadModel(t),
                    i = Live2D.getError();
                if (i) throw i;
                return e
            },
            createInternalModel: (t, e, i) => new rt(t, e, i),
            createPose: (t, e) => new dt(t, e),
            createPhysics: (t, e) => new lt(t, e)
        }), !window.Live2DCubismCore) throw new Error("Could not find Cubism 4 runtime. This plugin requires live2dcubismcore.js to be loaded.");
    class ut {
        constructor(t, e) {
            this.x = t || 0, this.y = e || 0
        }
        add(t) {
            const e = new ut(0, 0);
            return e.x = this.x + t.x, e.y = this.y + t.y, e
        }
        substract(t) {
            const e = new ut(0, 0);
            return e.x = this.x - t.x, e.y = this.y - t.y, e
        }
        multiply(t) {
            const e = new ut(0, 0);
            return e.x = this.x * t.x, e.y = this.y * t.y, e
        }
        multiplyByScaler(t) {
            return this.multiply(new ut(t, t))
        }
        division(t) {
            const e = new ut(0, 0);
            return e.x = this.x / t.x, e.y = this.y / t.y, e
        }
        divisionByScalar(t) {
            return this.division(new ut(t, t))
        }
        getLength() {
            return Math.sqrt(this.x * this.x + this.y * this.y)
        }
        getDistanceWith(t) {
            return Math.sqrt((this.x - t.x) * (this.x - t.x) + (this.y - t.y) * (this.y - t.y))
        }
        dot(t) {
            return this.x * t.x + this.y * t.y
        }
        normalize() {
            const t = Math.pow(this.x * this.x + this.y * this.y, .5);
            this.x = this.x / t, this.y = this.y / t
        }
        isEqual(t) {
            return this.x == t.x && this.y == t.y
        }
        isNotEqual(t) {
            return !this.isEqual(t)
        }
    }
    const ct = class {
        static range(t, e, i) {
            return t < e ? t = e : t > i && (t = i), t
        }
        static sin(t) {
            return Math.sin(t)
        }
        static cos(t) {
            return Math.cos(t)
        }
        static abs(t) {
            return Math.abs(t)
        }
        static sqrt(t) {
            return Math.sqrt(t)
        }
        static cbrt(t) {
            if (0 === t) return t;
            let e = t;
            const i = e < 0;
            let s;
            return i && (e = -e), e === 1 / 0 ? s = 1 / 0 : (s = Math.exp(Math.log(e) / 3), s = (e / (s * s) + 2 * s) / 3), i ? -s : s
        }
        static getEasingSine(t) {
            return t < 0 ? 0 : t > 1 ? 1 : .5 - .5 * this.cos(t * Math.PI)
        }
        static max(t, e) {
            return t > e ? t : e
        }
        static min(t, e) {
            return t > e ? e : t
        }
        static degreesToRadian(t) {
            return t / 180 * Math.PI
        }
        static radianToDegrees(t) {
            return 180 * t / Math.PI
        }
        static directionToRadian(t, e) {
            let i = Math.atan2(e.y, e.x) - Math.atan2(t.y, t.x);
            for (; i < -Math.PI;) i += 2 * Math.PI;
            for (; i > Math.PI;) i -= 2 * Math.PI;
            return i
        }
        static directionToDegrees(t, e) {
            const i = this.directionToRadian(t, e);
            let s = this.radianToDegrees(i);
            return e.x - t.x > 0 && (s = -s), s
        }
        static radianToDirection(t) {
            const e = new ut;
            return e.x = this.sin(t), e.y = this.cos(t), e
        }
        static quadraticEquation(t, e, i) {
            return this.abs(t) < ct.Epsilon ? this.abs(e) < ct.Epsilon ? -i : -i / e : -(e + this.sqrt(e * e - 4 * t * i)) / (2 * t)
        }
        static cardanoAlgorithmForBezier(t, e, i, s) {
            if (this.sqrt(t) < ct.Epsilon) return this.range(this.quadraticEquation(e, i, s), 0, 1);
            const r = e / t,
                a = i / t,
                o = (3 * a - r * r) / 3,
                n = o / 3,
                l = (2 * r * r * r - 9 * r * a + 27 * (s / t)) / 27,
                h = l / 2,
                d = h * h + n * n * n,
                u = .5,
                c = .51;
            if (d < 0) {
                const t = -o / 3,
                    e = t * t * t,
                    i = this.sqrt(e),
                    s = -l / (2 * i),
                    a = this.range(s, -1, 1),
                    n = Math.acos(a),
                    h = 2 * this.cbrt(i),
                    d = h * this.cos(n / 3) - r / 3;
                if (this.abs(d - u) < c) return this.range(d, 0, 1);
                const g = h * this.cos((n + 2 * Math.PI) / 3) - r / 3;
                if (this.abs(g - u) < c) return this.range(g, 0, 1);
                const m = h * this.cos((n + 4 * Math.PI) / 3) - r / 3;
                return this.range(m, 0, 1)
            }
            if (0 == d) {
                let t;
                t = h < 0 ? this.cbrt(-h) : -this.cbrt(h);
                const e = 2 * t - r / 3;
                if (this.abs(e - u) < c) return this.range(e, 0, 1);
                const i = -t - r / 3;
                return this.range(i, 0, 1)
            }
            const g = this.sqrt(d),
                m = this.cbrt(g - h) - this.cbrt(g + h) - r / 3;
            return this.range(m, 0, 1)
        }
        constructor() {}
    };
    let gt = ct;
    gt.Epsilon = 1e-5;
    class mt {
        constructor() {
            this._tr = new Float32Array(16), this.loadIdentity()
        }
        static multiply(t, e, i) {
            const s = new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
            for (let r = 0; r < 4; ++r)
                for (let i = 0; i < 4; ++i)
                    for (let a = 0; a < 4; ++a) s[i + 4 * r] += t[a + 4 * r] * e[i + 4 * a];
            for (let r = 0; r < 16; ++r) i[r] = s[r]
        }
        loadIdentity() {
            const t = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
            this.setMatrix(t)
        }
        setMatrix(t) {
            for (let e = 0; e < 16; ++e) this._tr[e] = t[e]
        }
        getArray() {
            return this._tr
        }
        getScaleX() {
            return this._tr[0]
        }
        getScaleY() {
            return this._tr[5]
        }
        getTranslateX() {
            return this._tr[12]
        }
        getTranslateY() {
            return this._tr[13]
        }
        transformX(t) {
            return this._tr[0] * t + this._tr[12]
        }
        transformY(t) {
            return this._tr[5] * t + this._tr[13]
        }
        invertTransformX(t) {
            return (t - this._tr[12]) / this._tr[0]
        }
        invertTransformY(t) {
            return (t - this._tr[13]) / this._tr[5]
        }
        translateRelative(t, e) {
            const i = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, t, e, 0, 1]);
            mt.multiply(i, this._tr, this._tr)
        }
        translate(t, e) {
            this._tr[12] = t, this._tr[13] = e
        }
        translateX(t) {
            this._tr[12] = t
        }
        translateY(t) {
            this._tr[13] = t
        }
        scaleRelative(t, e) {
            const i = new Float32Array([t, 0, 0, 0, 0, e, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
            mt.multiply(i, this._tr, this._tr)
        }
        scale(t, e) {
            this._tr[0] = t, this._tr[5] = e
        }
        multiplyByMatrix(t) {
            mt.multiply(t.getArray(), this._tr, this._tr)
        }
        clone() {
            const t = new mt;
            for (let e = 0; e < this._tr.length; e++) t._tr[e] = this._tr[e];
            return t
        }
    }
    class pt {
        initialize(t) {
            this._model = t
        }
        drawModel() {
            null != this.getModel() && this.doDrawModel()
        }
        setMvpMatrix(t) {
            this._mvpMatrix4x4.setMatrix(t.getArray())
        }
        getMvpMatrix() {
            return this._mvpMatrix4x4
        }
        setModelColor(t, e, i, s) {
            t < 0 ? t = 0 : t > 1 && (t = 1), e < 0 ? e = 0 : e > 1 && (e = 1), i < 0 ? i = 0 : i > 1 && (i = 1), s < 0 ? s = 0 : s > 1 && (s = 1), this._modelColor.R = t, this._modelColor.G = e, this._modelColor.B = i, this._modelColor.A = s
        }
        getModelColor() {
            return Object.assign({}, this._modelColor)
        }
        setIsPremultipliedAlpha(t) {
            this._isPremultipliedAlpha = t
        }
        isPremultipliedAlpha() {
            return this._isPremultipliedAlpha
        }
        setIsCulling(t) {
            this._isCulling = t
        }
        isCulling() {
            return this._isCulling
        }
        setAnisotropy(t) {
            this._anisortopy = t
        }
        getAnisotropy() {
            return this._anisortopy
        }
        getModel() {
            return this._model
        }
        constructor() {
            this._isCulling = !1, this._isPremultipliedAlpha = !1, this._anisortopy = 0, this._modelColor = new ft, this._mvpMatrix4x4 = new mt, this._mvpMatrix4x4.loadIdentity()
        }
    }
    var _t = (t => (t[t.CubismBlendMode_Normal = 0] = "CubismBlendMode_Normal", t[t.CubismBlendMode_Additive = 1] = "CubismBlendMode_Additive", t[t.CubismBlendMode_Multiplicative = 2] = "CubismBlendMode_Multiplicative", t))(_t || {});
    class ft {
        constructor() {
            this.R = 1, this.G = 1, this.B = 1, this.A = 1
        }
    }
    let xt, yt = !1,
        Mt = !1;
    const vt = 0,
        Pt = 2;
    class Ct {
        static startUp(t) {
            if (yt) return It("CubismFramework.startUp() is already done."), yt;
            if (Live2DCubismCore._isStarted) return yt = !0, !0;
            if (Live2DCubismCore._isStarted = !0, xt = t, xt && Live2DCubismCore.Logging.csmSetLogFunction(xt.logFunction), yt = !0, yt) {
                const t = Live2DCubismCore.Version.csmGetVersion(),
                    e = (16711680 & t) >> 16,
                    i = 65535 & t,
                    s = t;
                It("Live2D Cubism Core version: {0}.{1}.{2} ({3})", ("00" + ((4278190080 & t) >> 24)).slice(-2), ("00" + e).slice(-2), ("0000" + i).slice(-4), s)
            }
            return It("CubismFramework.startUp() is complete."), yt
        }
        static cleanUp() {
            yt = !1, Mt = !1, xt = void 0
        }
        static initialize() {
            yt ? Mt ? wt("CubismFramework.initialize() skipped, already initialized.") : (Mt = !0, It("CubismFramework.initialize() is complete.")) : wt("CubismFramework is not started.")
        }
        static dispose() {
            yt ? Mt ? (pt.staticRelease(), Mt = !1, It("CubismFramework.dispose() is complete.")) : wt("CubismFramework.dispose() skipped, not initialized.") : wt("CubismFramework is not started.")
        }
        static isStarted() {
            return yt
        }
        static isInitialized() {
            return Mt
        }
        static coreLogFunction(t) {
            Live2DCubismCore.Logging.csmGetLogFunction() && Live2DCubismCore.Logging.csmGetLogFunction()(t)
        }
        static getLoggingLevel() {
            return null != xt ? xt.loggingLevel : St.LogLevel_Off
        }
        constructor() {}
    }
    var St = (t => (t[t.LogLevel_Verbose = 0] = "LogLevel_Verbose", t[t.LogLevel_Debug = 1] = "LogLevel_Debug", t[t.LogLevel_Info = 2] = "LogLevel_Info", t[t.LogLevel_Warning = 3] = "LogLevel_Warning", t[t.LogLevel_Error = 4] = "LogLevel_Error", t[t.LogLevel_Off = 5] = "LogLevel_Off", t))(St || {});

    function bt(t, ...e) {
        Lt.print(St.LogLevel_Debug, "[CSM][D]" + t + "\n", e)
    }

    function It(t, ...e) {
        Lt.print(St.LogLevel_Info, "[CSM][I]" + t + "\n", e)
    }

    function wt(t, ...e) {
        Lt.print(St.LogLevel_Warning, "[CSM][W]" + t + "\n", e)
    }

    function Tt(t, ...e) {
        Lt.print(St.LogLevel_Error, "[CSM][E]" + t + "\n", e)
    }
    class Lt {
        static print(t, e, i) {
            if (t < Ct.getLoggingLevel()) return;
            const s = Ct.coreLogFunction;
            if (!s) return;
            s(e.replace(/{(\d+)}/g, ((t, e) => i[e])))
        }
        static dumpBytes(t, e, i) {
            for (let s = 0; s < i; s++) s % 16 == 0 && s > 0 ? this.print(t, "\n") : s % 8 == 0 && s > 0 && this.print(t, "  "), this.print(t, "{0} ", [255 & e[s]]);
            this.print(t, "\n")
        }
        constructor() {}
    }
    class Et {
        constructor() {
            this._fadeInSeconds = -1, this._fadeOutSeconds = -1, this._weight = 1, this._offsetSeconds = 0, this._firedEventValues = []
        }
        release() {
            this._weight = 0
        }
        updateParameters(t, e, i) {
            if (!e.isAvailable() || e.isFinished()) return;
            if (!e.isStarted()) {
                e.setIsStarted(!0), e.setStartTime(i - this._offsetSeconds), e.setFadeInStartTime(i);
                const t = this.getDuration();
                e.getEndTime() < 0 && e.setEndTime(t <= 0 ? -1 : e.getStartTime() + t)
            }
            let s = this._weight;
            s = s * (0 == this._fadeInSeconds ? 1 : gt.getEasingSine((i - e.getFadeInStartTime()) / this._fadeInSeconds)) * (0 == this._fadeOutSeconds || e.getEndTime() < 0 ? 1 : gt.getEasingSine((e.getEndTime() - i) / this._fadeOutSeconds)), e.setState(i, s), this.doUpdateParameters(t, i, s, e), e.getEndTime() > 0 && e.getEndTime() < i && e.setIsFinished(!0)
        }
        setFadeInTime(t) {
            this._fadeInSeconds = t
        }
        setFadeOutTime(t) {
            this._fadeOutSeconds = t
        }
        getFadeOutTime() {
            return this._fadeOutSeconds
        }
        getFadeInTime() {
            return this._fadeInSeconds
        }
        setWeight(t) {
            this._weight = t
        }
        getWeight() {
            return this._weight
        }
        getDuration() {
            return -1
        }
        getLoopDuration() {
            return -1
        }
        setOffsetTime(t) {
            this._offsetSeconds = t
        }
        getFiredEvent(t, e) {
            return this._firedEventValues
        }
        setFinishedMotionHandler(t) {
            this._onFinishedMotion = t
        }
        getFinishedMotionHandler() {
            return this._onFinishedMotion
        }
    }
    class Ft extends Et {
        constructor() {
            super(), this._parameters = []
        }
        static create(t) {
            const e = new Ft,
                i = t.FadeInTime,
                s = t.FadeOutTime;
            e.setFadeInTime(void 0 !== i ? i : 1), e.setFadeOutTime(void 0 !== s ? s : 1);
            const r = t.Parameters || [];
            for (let a = 0; a < r.length; ++a) {
                const t = r[a],
                    i = t.Id,
                    s = t.Value;
                let o;
                switch (t.Blend) {
                    case "Multiply":
                        o = Dt.ExpressionBlendType_Multiply;
                        break;
                    case "Overwrite":
                        o = Dt.ExpressionBlendType_Overwrite;
                        break;
                    default:
                        o = Dt.ExpressionBlendType_Add
                }
                const n = {
                    parameterId: i,
                    blendType: o,
                    value: s
                };
                e._parameters.push(n)
            }
            return e
        }
        doUpdateParameters(t, e, i, s) {
            for (let r = 0; r < this._parameters.length; ++r) {
                const e = this._parameters[r];
                switch (e.blendType) {
                    case Dt.ExpressionBlendType_Add:
                        t.addParameterValueById(e.parameterId, e.value, i);
                        break;
                    case Dt.ExpressionBlendType_Multiply:
                        t.multiplyParameterValueById(e.parameterId, e.value, i);
                        break;
                    case Dt.ExpressionBlendType_Overwrite:
                        t.setParameterValueById(e.parameterId, e.value, i)
                }
            }
        }
    }
    var Dt = (t => (t[t.ExpressionBlendType_Add = 0] = "ExpressionBlendType_Add", t[t.ExpressionBlendType_Multiply = 1] = "ExpressionBlendType_Multiply", t[t.ExpressionBlendType_Overwrite = 2] = "ExpressionBlendType_Overwrite", t))(Dt || {});
    class At {
        constructor() {
            this._autoDelete = !1, this._available = !0, this._finished = !1, this._started = !1, this._startTimeSeconds = -1, this._fadeInStartTimeSeconds = 0, this._endTimeSeconds = -1, this._stateTimeSeconds = 0, this._stateWeight = 0, this._lastEventCheckSeconds = 0, this._motionQueueEntryHandle = this, this._fadeOutSeconds = 0, this._isTriggeredFadeOut = !1
        }
        release() {
            this._autoDelete && this._motion && this._motion.release()
        }
        setFadeOut(t) {
            this._fadeOutSeconds = t, this._isTriggeredFadeOut = !0
        }
        startFadeOut(t, e) {
            const i = e + t;
            this._isTriggeredFadeOut = !0, (this._endTimeSeconds < 0 || i < this._endTimeSeconds) && (this._endTimeSeconds = i)
        }
        isFinished() {
            return this._finished
        }
        isStarted() {
            return this._started
        }
        getStartTime() {
            return this._startTimeSeconds
        }
        getFadeInStartTime() {
            return this._fadeInStartTimeSeconds
        }
        getEndTime() {
            return this._endTimeSeconds
        }
        setStartTime(t) {
            this._startTimeSeconds = t
        }
        setFadeInStartTime(t) {
            this._fadeInStartTimeSeconds = t
        }
        setEndTime(t) {
            this._endTimeSeconds = t
        }
        setIsFinished(t) {
            this._finished = t
        }
        setIsStarted(t) {
            this._started = t
        }
        isAvailable() {
            return this._available
        }
        setIsAvailable(t) {
            this._available = t
        }
        setState(t, e) {
            this._stateTimeSeconds = t, this._stateWeight = e
        }
        getStateTime() {
            return this._stateTimeSeconds
        }
        getStateWeight() {
            return this._stateWeight
        }
        getLastCheckEventSeconds() {
            return this._lastEventCheckSeconds
        }
        setLastCheckEventSeconds(t) {
            this._lastEventCheckSeconds = t
        }
        isTriggeredFadeOut() {
            return this._isTriggeredFadeOut
        }
        getFadeOutSeconds() {
            return this._fadeOutSeconds
        }
    }
    class Bt {
        constructor() {
            this._userTimeSeconds = 0, this._eventCustomData = null, this._motions = []
        }
        release() {
            for (let t = 0; t < this._motions.length; ++t) this._motions[t] && this._motions[t].release();
            this._motions = void 0
        }
        startMotion(t, e, i) {
            if (null == t) return Rt;
            let s;
            for (let r = 0; r < this._motions.length; ++r) s = this._motions[r], null != s && s.setFadeOut(s._motion.getFadeOutTime());
            return s = new At, s._autoDelete = e, s._motion = t, this._motions.push(s), s._motionQueueEntryHandle
        }
        isFinished() {
            let t = 0;
            for (; t < this._motions.length;) {
                const e = this._motions[t];
                if (null == e) {
                    this._motions.splice(t, 1);
                    continue
                }
                if (null != e._motion) {
                    if (!e.isFinished()) return !1;
                    t++
                } else e.release(), this._motions.splice(t, 1)
            }
            return !0
        }
        isFinishedByHandle(t) {
            for (let e = 0; e < this._motions.length; e++) {
                const i = this._motions[e];
                if (null != i && (i._motionQueueEntryHandle == t && !i.isFinished())) return !1
            }
            return !0
        }
        stopAllMotions() {
            for (let t = 0; t < this._motions.length; t++) {
                const e = this._motions[t];
                null != e && e.release()
            }
            this._motions = []
        }
        getCubismMotionQueueEntry(t) {
            return this._motions.find((e => null != e && e._motionQueueEntryHandle == t))
        }
        setEventCallback(t, e = null) {
            this._eventCallBack = t, this._eventCustomData = e
        }
        doUpdateMotion(t, e) {
            let i = !1,
                s = 0;
            for (; s < this._motions.length;) {
                const r = this._motions[s];
                if (null == r) {
                    this._motions.splice(s, 1);
                    continue
                }
                const a = r._motion;
                if (null == a) {
                    r.release(), this._motions.splice(s, 1);
                    continue
                }
                a.updateParameters(t, r, e), i = !0;
                const o = a.getFiredEvent(r.getLastCheckEventSeconds() - r.getStartTime(), e - r.getStartTime());
                for (let t = 0; t < o.length; ++t) this._eventCallBack(this, o[t], this._eventCustomData);
                r.setLastCheckEventSeconds(e), r.isFinished() ? (r.release(), this._motions.splice(s, 1)) : (r.isTriggeredFadeOut() && r.startFadeOut(r.getFadeOutSeconds(), e), s++)
            }
            return i
        }
    }
    const Rt = -1;
    class Ot extends _ {
        constructor(t, e) {
            var i;
            super(t, e), this.queueManager = new Bt, this.definitions = null != (i = t.expressions) ? i : [], this.init()
        }
        isFinished() {
            return this.queueManager.isFinished()
        }
        getExpressionIndex(t) {
            return this.definitions.findIndex((e => e.Name === t))
        }
        getExpressionFile(t) {
            return t.File
        }
        createExpression(t, e) {
            return Ft.create(t)
        }
        _setExpression(t) {
            return this.queueManager.startMotion(t, !1, performance.now())
        }
        stopAllExpressions() {
            this.queueManager.stopAllMotions()
        }
        updateParameters(t, e) {
            return this.queueManager.doUpdateMotion(t, e)
        }
    }
    class kt {
        constructor(t) {
            this.groups = t.Groups, this.hitAreas = t.HitAreas, this.layout = t.Layout, this.moc = t.FileReferences.Moc, this.expressions = t.FileReferences.Expressions, this.motions = t.FileReferences.Motions, this.textures = t.FileReferences.Textures, this.physics = t.FileReferences.Physics, this.pose = t.FileReferences.Pose
        }
        getEyeBlinkParameters() {
            var t, e;
            return null == (e = null == (t = this.groups) ? void 0 : t.find((t => "EyeBlink" === t.Name))) ? void 0 : e.Ids
        }
        getLipSyncParameters() {
            var t, e;
            return null == (e = null == (t = this.groups) ? void 0 : t.find((t => "LipSync" === t.Name))) ? void 0 : e.Ids
        }
    }
    class Ut extends x {
        constructor(t) {
            if (super(t), !Ut.isValidJSON(t)) throw new TypeError("Invalid JSON.");
            Object.assign(this, new kt(t))
        }
        static isValidJSON(t) {
            var e;
            return !!(null == t ? void 0 : t.FileReferences) && "string" == typeof t.FileReferences.Moc && (null == (e = t.FileReferences.Textures) ? void 0 : e.length) > 0 && t.FileReferences.Textures.every((t => "string" == typeof t))
        }
        replaceFiles(t) {
            if (super.replaceFiles(t), this.motions)
                for (const [e, i] of Object.entries(this.motions))
                    for (let s = 0; s < i.length; s++) i[s].File = t(i[s].File, `motions.${e}[${s}].File`), void 0 !== i[s].Sound && (i[s].Sound = t(i[s].Sound, `motions.${e}[${s}].Sound`));
            if (this.expressions)
                for (let e = 0; e < this.expressions.length; e++) this.expressions[e].File = t(this.expressions[e].File, `expressions[${e}].File`)
        }
    }
    g(Ut, [kt]);
    var Nt = (t => (t[t.CubismMotionCurveTarget_Model = 0] = "CubismMotionCurveTarget_Model", t[t.CubismMotionCurveTarget_Parameter = 1] = "CubismMotionCurveTarget_Parameter", t[t.CubismMotionCurveTarget_PartOpacity = 2] = "CubismMotionCurveTarget_PartOpacity", t))(Nt || {}),
        Vt = (t => (t[t.CubismMotionSegmentType_Linear = 0] = "CubismMotionSegmentType_Linear", t[t.CubismMotionSegmentType_Bezier = 1] = "CubismMotionSegmentType_Bezier", t[t.CubismMotionSegmentType_Stepped = 2] = "CubismMotionSegmentType_Stepped", t[t.CubismMotionSegmentType_InverseStepped = 3] = "CubismMotionSegmentType_InverseStepped", t))(Vt || {});
    class Gt {
        constructor(t = 0, e = 0) {
            this.time = t, this.value = e
        }
    }
    class jt {
        constructor() {
            this.basePointIndex = 0, this.segmentType = 0
        }
    }
    class Xt {
        constructor() {
            this.id = "", this.type = 0, this.segmentCount = 0, this.baseSegmentIndex = 0, this.fadeInTime = 0, this.fadeOutTime = 0
        }
    }
    class zt {
        constructor() {
            this.fireTime = 0, this.value = ""
        }
    }
    class Wt {
        constructor() {
            this.duration = 0, this.loop = !1, this.curveCount = 0, this.eventCount = 0, this.fps = 0, this.curves = [], this.segments = [], this.points = [], this.events = []
        }
    }
    class Yt {
        constructor(t) {
            this._json = t
        }
        release() {
            this._json = void 0
        }
        getMotionDuration() {
            return this._json.Meta.Duration
        }
        isMotionLoop() {
            return this._json.Meta.Loop || !1
        }
        getEvaluationOptionFlag(t) {
            return Ht.EvaluationOptionFlag_AreBeziersRistricted == t && !!this._json.Meta.AreBeziersRestricted
        }
        getMotionCurveCount() {
            return this._json.Meta.CurveCount
        }
        getMotionFps() {
            return this._json.Meta.Fps
        }
        getMotionTotalSegmentCount() {
            return this._json.Meta.TotalSegmentCount
        }
        getMotionTotalPointCount() {
            return this._json.Meta.TotalPointCount
        }
        getMotionFadeInTime() {
            return this._json.Meta.FadeInTime
        }
        getMotionFadeOutTime() {
            return this._json.Meta.FadeOutTime
        }
        getMotionCurveTarget(t) {
            return this._json.Curves[t].Target
        }
        getMotionCurveId(t) {
            return this._json.Curves[t].Id
        }
        getMotionCurveFadeInTime(t) {
            return this._json.Curves[t].FadeInTime
        }
        getMotionCurveFadeOutTime(t) {
            return this._json.Curves[t].FadeOutTime
        }
        getMotionCurveSegmentCount(t) {
            return this._json.Curves[t].Segments.length
        }
        getMotionCurveSegment(t, e) {
            return this._json.Curves[t].Segments[e]
        }
        getEventCount() {
            return this._json.Meta.UserDataCount || 0
        }
        getTotalEventValueSize() {
            return this._json.Meta.TotalUserDataSize
        }
        getEventTime(t) {
            return this._json.UserData[t].Time
        }
        getEventValue(t) {
            return this._json.UserData[t].Value
        }
    }
    var Ht = (t => (t[t.EvaluationOptionFlag_AreBeziersRistricted = 0] = "EvaluationOptionFlag_AreBeziersRistricted", t))(Ht || {});

    function qt(t, e, i) {
        const s = new Gt;
        return s.time = t.time + (e.time - t.time) * i, s.value = t.value + (e.value - t.value) * i, s
    }

    function $t(t, e) {
        let i = (e - t[0].time) / (t[1].time - t[0].time);
        return i < 0 && (i = 0), t[0].value + (t[1].value - t[0].value) * i
    }

    function Zt(t, e) {
        let i = (e - t[0].time) / (t[3].time - t[0].time);
        i < 0 && (i = 0);
        const s = qt(t[0], t[1], i),
            r = qt(t[1], t[2], i),
            a = qt(t[2], t[3], i),
            o = qt(s, r, i),
            n = qt(r, a, i);
        return qt(o, n, i).value
    }

    function Jt(t, e) {
        const i = e,
            s = t[0].time,
            r = t[3].time,
            a = t[1].time,
            o = t[2].time,
            n = r - 3 * o + 3 * a - s,
            l = 3 * o - 6 * a + 3 * s,
            h = 3 * a - 3 * s,
            d = s - i,
            u = gt.cardanoAlgorithmForBezier(n, l, h, d),
            c = qt(t[0], t[1], u),
            g = qt(t[1], t[2], u),
            m = qt(t[2], t[3], u),
            p = qt(c, g, u),
            _ = qt(g, m, u);
        return qt(p, _, u).value
    }

    function Qt(t, e) {
        return t[0].value
    }

    function Kt(t, e) {
        return t[1].value
    }

    function te(t, e, i) {
        const s = t.curves[e];
        let r = -1;
        const a = s.baseSegmentIndex + s.segmentCount;
        let o = 0;
        for (let l = s.baseSegmentIndex; l < a; ++l)
            if (o = t.segments[l].basePointIndex + (t.segments[l].segmentType == Vt.CubismMotionSegmentType_Bezier ? 3 : 1), t.points[o].time > i) {
                r = l;
                break
            } if (-1 == r) return t.points[o].value;
        const n = t.segments[r];
        return n.evaluate(t.points.slice(n.basePointIndex), i)
    }
    class ee extends Et {
        constructor() {
            super(), this._eyeBlinkParameterIds = [], this._lipSyncParameterIds = [], this._sourceFrameRate = 30, this._loopDurationSeconds = -1, this._isLoop = !1, this._isLoopFadeIn = !0, this._lastWeight = 0
        }
        static create(t, e) {
            const i = new ee;
            return i.parse(t), i._sourceFrameRate = i._motionData.fps, i._loopDurationSeconds = i._motionData.duration, i._onFinishedMotion = e, i
        }
        doUpdateParameters(t, e, i, s) {
            null == this._modelCurveIdEyeBlink && (this._modelCurveIdEyeBlink = "EyeBlink"), null == this._modelCurveIdLipSync && (this._modelCurveIdLipSync = "LipSync");
            let r = e - s.getStartTime();
            r < 0 && (r = 0);
            let o = Number.MAX_VALUE,
                n = Number.MAX_VALUE;
            const l = 64;
            let h = 0,
                d = 0;
            this._eyeBlinkParameterIds.length > l && bt("too many eye blink targets : {0}", this._eyeBlinkParameterIds.length), this._lipSyncParameterIds.length > l && bt("too many lip sync targets : {0}", this._lipSyncParameterIds.length);
            const u = this._fadeInSeconds <= 0 ? 1 : gt.getEasingSine((e - s.getFadeInStartTime()) / this._fadeInSeconds),
                c = this._fadeOutSeconds <= 0 || s.getEndTime() < 0 ? 1 : gt.getEasingSine((s.getEndTime() - e) / this._fadeOutSeconds);
            let g, m, p, _ = r;
            if (this._isLoop)
                for (; _ > this._motionData.duration;) _ -= this._motionData.duration;
            const f = this._motionData.curves;
            for (m = 0; m < this._motionData.curveCount && f[m].type == Nt.CubismMotionCurveTarget_Model; ++m) g = te(this._motionData, m, _), f[m].id == this._modelCurveIdEyeBlink ? n = g : f[m].id == this._modelCurveIdLipSync && (o = g);
            for (; m < this._motionData.curveCount && f[m].type == Nt.CubismMotionCurveTarget_Parameter; ++m) {
                if (p = t.getParameterIndex(f[m].id), -1 == p) continue;
                const r = t.getParameterValueByIndex(p);
                if (g = te(this._motionData, m, _), n != Number.MAX_VALUE)
                    for (let t = 0; t < this._eyeBlinkParameterIds.length && t < l; ++t)
                        if (this._eyeBlinkParameterIds[t] == f[m].id) {
                            g *= n, d |= 1 << t;
                            break
                        } if (o != Number.MAX_VALUE)
                    for (let t = 0; t < this._lipSyncParameterIds.length && t < l; ++t)
                        if (this._lipSyncParameterIds[t] == f[m].id) {
                            g += o, h |= 1 << t;
                            break
                        } let a;
                if (f[m].fadeInTime < 0 && f[m].fadeOutTime < 0) a = r + (g - r) * i;
                else {
                    let t, i;
                    t = f[m].fadeInTime < 0 ? u : 0 == f[m].fadeInTime ? 1 : gt.getEasingSine((e - s.getFadeInStartTime()) / f[m].fadeInTime), i = f[m].fadeOutTime < 0 ? c : 0 == f[m].fadeOutTime || s.getEndTime() < 0 ? 1 : gt.getEasingSine((s.getEndTime() - e) / f[m].fadeOutTime);
                    a = r + (g - r) * (this._weight * t * i)
                }
                t.setParameterValueByIndex(p, a, 1)
            }
            if (n != Number.MAX_VALUE)
                for (let a = 0; a < this._eyeBlinkParameterIds.length && a < l; ++a) {
                    const e = t.getParameterValueById(this._eyeBlinkParameterIds[a]);
                    if (d >> a & 1) continue;
                    const s = e + (n - e) * i;
                    t.setParameterValueById(this._eyeBlinkParameterIds[a], s)
                }
            if (o != Number.MAX_VALUE)
                for (let a = 0; a < this._lipSyncParameterIds.length && a < l; ++a) {
                    const e = t.getParameterValueById(this._lipSyncParameterIds[a]);
                    if (h >> a & 1) continue;
                    const s = e + (o - e) * i;
                    t.setParameterValueById(this._lipSyncParameterIds[a], s)
                }
            for (; m < this._motionData.curveCount && f[m].type == Nt.CubismMotionCurveTarget_PartOpacity; ++m)
                if (g = te(this._motionData, m, _), a.setOpacityFromMotion) t.setPartOpacityById(f[m].id, g);
                else {
                    if (p = t.getParameterIndex(f[m].id), -1 == p) continue;
                    t.setParameterValueByIndex(p, g)
                } r >= this._motionData.duration && (this._isLoop ? (s.setStartTime(e), this._isLoopFadeIn && s.setFadeInStartTime(e)) : (this._onFinishedMotion && this._onFinishedMotion(this), s.setIsFinished(!0))), this._lastWeight = i
        }
        setIsLoop(t) {
            this._isLoop = t
        }
        isLoop() {
            return this._isLoop
        }
        setIsLoopFadeIn(t) {
            this._isLoopFadeIn = t
        }
        isLoopFadeIn() {
            return this._isLoopFadeIn
        }
        getDuration() {
            return this._isLoop ? -1 : this._loopDurationSeconds
        }
        getLoopDuration() {
            return this._loopDurationSeconds
        }
        setParameterFadeInTime(t, e) {
            const i = this._motionData.curves;
            for (let s = 0; s < this._motionData.curveCount; ++s)
                if (t == i[s].id) return void(i[s].fadeInTime = e)
        }
        setParameterFadeOutTime(t, e) {
            const i = this._motionData.curves;
            for (let s = 0; s < this._motionData.curveCount; ++s)
                if (t == i[s].id) return void(i[s].fadeOutTime = e)
        }
        getParameterFadeInTime(t) {
            const e = this._motionData.curves;
            for (let i = 0; i < this._motionData.curveCount; ++i)
                if (t == e[i].id) return e[i].fadeInTime;
            return -1
        }
        getParameterFadeOutTime(t) {
            const e = this._motionData.curves;
            for (let i = 0; i < this._motionData.curveCount; ++i)
                if (t == e[i].id) return e[i].fadeOutTime;
            return -1
        }
        setEffectIds(t, e) {
            this._eyeBlinkParameterIds = t, this._lipSyncParameterIds = e
        }
        release() {
            this._motionData = void 0
        }
        parse(t) {
            this._motionData = new Wt;
            let e = new Yt(t);
            this._motionData.duration = e.getMotionDuration(), this._motionData.loop = e.isMotionLoop(), this._motionData.curveCount = e.getMotionCurveCount(), this._motionData.fps = e.getMotionFps(), this._motionData.eventCount = e.getEventCount();
            const i = e.getEvaluationOptionFlag(Ht.EvaluationOptionFlag_AreBeziersRistricted),
                s = e.getMotionFadeInTime(),
                r = e.getMotionFadeOutTime();
            this._fadeInSeconds = void 0 !== s ? s < 0 ? 1 : s : 1, this._fadeOutSeconds = void 0 !== r ? r < 0 ? 1 : r : 1, this._motionData.curves = Array.from({
                length: this._motionData.curveCount
            }).map((() => new Xt)), this._motionData.segments = Array.from({
                length: e.getMotionTotalSegmentCount()
            }).map((() => new jt)), this._motionData.events = Array.from({
                length: this._motionData.eventCount
            }).map((() => new zt)), this._motionData.points = [];
            let a = 0,
                o = 0;
            for (let n = 0; n < this._motionData.curveCount; ++n) {
                const t = this._motionData.curves[n];
                switch (e.getMotionCurveTarget(n)) {
                    case "Model":
                        t.type = Nt.CubismMotionCurveTarget_Model;
                        break;
                    case "Parameter":
                        t.type = Nt.CubismMotionCurveTarget_Parameter;
                        break;
                    case "PartOpacity":
                        t.type = Nt.CubismMotionCurveTarget_PartOpacity;
                        break;
                    default:
                        wt('Warning : Unable to get segment type from Curve! The number of "CurveCount" may be incorrect!')
                }
                t.id = e.getMotionCurveId(n), t.baseSegmentIndex = o;
                const s = e.getMotionCurveFadeInTime(n),
                    r = e.getMotionCurveFadeOutTime(n);
                t.fadeInTime = void 0 !== s ? s : -1, t.fadeOutTime = void 0 !== r ? r : -1;
                for (let l = 0; l < e.getMotionCurveSegmentCount(n);) {
                    0 == l ? (this._motionData.segments[o].basePointIndex = a, this._motionData.points[a] = new Gt(e.getMotionCurveSegment(n, l), e.getMotionCurveSegment(n, l + 1)), a += 1, l += 2) : this._motionData.segments[o].basePointIndex = a - 1;
                    switch (e.getMotionCurveSegment(n, l)) {
                        case Vt.CubismMotionSegmentType_Linear:
                            this._motionData.segments[o].segmentType = Vt.CubismMotionSegmentType_Linear, this._motionData.segments[o].evaluate = $t, this._motionData.points[a] = new Gt(e.getMotionCurveSegment(n, l + 1), e.getMotionCurveSegment(n, l + 2)), a += 1, l += 3;
                            break;
                        case Vt.CubismMotionSegmentType_Bezier:
                            this._motionData.segments[o].segmentType = Vt.CubismMotionSegmentType_Bezier, this._motionData.segments[o].evaluate = i ? Zt : Jt, this._motionData.points[a] = new Gt(e.getMotionCurveSegment(n, l + 1), e.getMotionCurveSegment(n, l + 2)), this._motionData.points[a + 1] = new Gt(e.getMotionCurveSegment(n, l + 3), e.getMotionCurveSegment(n, l + 4)), this._motionData.points[a + 2] = new Gt(e.getMotionCurveSegment(n, l + 5), e.getMotionCurveSegment(n, l + 6)), a += 3, l += 7;
                            break;
                        case Vt.CubismMotionSegmentType_Stepped:
                            this._motionData.segments[o].segmentType = Vt.CubismMotionSegmentType_Stepped, this._motionData.segments[o].evaluate = Qt, this._motionData.points[a] = new Gt(e.getMotionCurveSegment(n, l + 1), e.getMotionCurveSegment(n, l + 2)), a += 1, l += 3;
                            break;
                        case Vt.CubismMotionSegmentType_InverseStepped:
                            this._motionData.segments[o].segmentType = Vt.CubismMotionSegmentType_InverseStepped, this._motionData.segments[o].evaluate = Kt, this._motionData.points[a] = new Gt(e.getMotionCurveSegment(n, l + 1), e.getMotionCurveSegment(n, l + 2)), a += 1, l += 3
                    }++t.segmentCount, ++o
                }
                this._motionData.curves.push(t)
            }
            for (let n = 0; n < e.getEventCount(); ++n) this._motionData.events[n].fireTime = e.getEventTime(n), this._motionData.events[n].value = e.getEventValue(n);
            e.release()
        }
        getFiredEvent(t, e) {
            this._firedEventValues.length = 0;
            for (let i = 0; i < this._motionData.eventCount; ++i) this._motionData.events[i].fireTime > t && this._motionData.events[i].fireTime <= e && this._firedEventValues.push(this._motionData.events[i].value);
            return this._firedEventValues
        }
    }
    class ie extends C {
        constructor(t, e) {
            var i;
            super(t, e), this.groups = {
                idle: "Idle"
            }, this.motionDataType = "json", this.queueManager = new Bt, this.definitions = null != (i = t.motions) ? i : {}, this.eyeBlinkIds = t.getEyeBlinkParameters() || [], this.lipSyncIds = t.getLipSyncParameters() || [], this.init(e)
        }
        init(t) {
            super.init(t), this.settings.expressions && (this.expressionManager = new Ot(this.settings, t)), this.queueManager.setEventCallback(((t, e, i) => {
                this.emit("motion:" + e)
            }))
        }
        isFinished() {
            return this.queueManager.isFinished()
        }
        _startMotion(t, e) {
            return t.setFinishedMotionHandler(e), this.queueManager.stopAllMotions(), this.queueManager.startMotion(t, !1, performance.now())
        }
        _stopAllMotions() {
            this.queueManager.stopAllMotions()
        }
        createMotion(e, i, s) {
            const r = ee.create(e),
                a = new Yt(e),
                o = (i === this.groups.idle ? t.config.idleMotionFadingDuration : t.config.motionFadingDuration) / 1e3;
            return void 0 === a.getMotionFadeInTime() && r.setFadeInTime(s.FadeInTime > 0 ? s.FadeInTime : o), void 0 === a.getMotionFadeOutTime() && r.setFadeOutTime(s.FadeOutTime > 0 ? s.FadeOutTime : o), r.setEffectIds(this.eyeBlinkIds, this.lipSyncIds), r
        }
        getMotionFile(t) {
            return t.File
        }
        getMotionName(t) {
            return t.File
        }
        getSoundFile(t) {
            return t.Sound
        }
        updateParameters(t, e) {
            return this.queueManager.doUpdateMotion(t, e)
        }
        destroy() {
            super.destroy(), this.queueManager.release(), this.queueManager = void 0
        }
    }
    class se {
        constructor() {
            this._breathParameters = [], this._currentTime = 0
        }
        static create() {
            return new se
        }
        setParameters(t) {
            this._breathParameters = t
        }
        getParameters() {
            return this._breathParameters
        }
        updateParameters(t, e) {
            this._currentTime += e;
            const i = 2 * this._currentTime * 3.14159;
            for (let s = 0; s < this._breathParameters.length; ++s) {
                const e = this._breathParameters[s];
                t.addParameterValueById(e.parameterId, e.offset + e.peak * Math.sin(i / e.cycle), e.weight)
            }
        }
    }
    class re {
        constructor(t, e, i, s, r) {
            this.parameterId = null == t ? void 0 : t, this.offset = null == e ? 0 : e, this.peak = null == i ? 0 : i, this.cycle = null == s ? 0 : s, this.weight = null == r ? 0 : r
        }
    }
    const ae = class {
        static create(t) {
            return new ae(t)
        }
        setBlinkingInterval(t) {
            this._blinkingIntervalSeconds = t
        }
        setBlinkingSetting(t, e, i) {
            this._closingSeconds = t, this._closedSeconds = e, this._openingSeconds = i
        }
        setParameterIds(t) {
            this._parameterIds = t
        }
        getParameterIds() {
            return this._parameterIds
        }
        updateParameters(t, e) {
            let i;
            this._userTimeSeconds += e;
            let s = 0;
            switch (this._blinkingState) {
                case ne.EyeState_Closing:
                    s = (this._userTimeSeconds - this._stateStartTimeSeconds) / this._closingSeconds, s >= 1 && (s = 1, this._blinkingState = ne.EyeState_Closed, this._stateStartTimeSeconds = this._userTimeSeconds), i = 1 - s;
                    break;
                case ne.EyeState_Closed:
                    s = (this._userTimeSeconds - this._stateStartTimeSeconds) / this._closedSeconds, s >= 1 && (this._blinkingState = ne.EyeState_Opening, this._stateStartTimeSeconds = this._userTimeSeconds), i = 0;
                    break;
                case ne.EyeState_Opening:
                    s = (this._userTimeSeconds - this._stateStartTimeSeconds) / this._openingSeconds, s >= 1 && (s = 1, this._blinkingState = ne.EyeState_Interval, this._nextBlinkingTime = this.determinNextBlinkingTiming()), i = s;
                    break;
                case ne.EyeState_Interval:
                    this._nextBlinkingTime < this._userTimeSeconds && (this._blinkingState = ne.EyeState_Closing, this._stateStartTimeSeconds = this._userTimeSeconds), i = 1;
                    break;
                case ne.EyeState_First:
                default:
                    this._blinkingState = ne.EyeState_Interval, this._nextBlinkingTime = this.determinNextBlinkingTiming(), i = 1
            }
            ae.CloseIfZero || (i = -i);
            for (let r = 0; r < this._parameterIds.length; ++r) t.setParameterValueById(this._parameterIds[r], i)
        }
        constructor(t) {
            var e, i;
            this._blinkingState = ne.EyeState_First, this._nextBlinkingTime = 0, this._stateStartTimeSeconds = 0, this._blinkingIntervalSeconds = 4, this._closingSeconds = .1, this._closedSeconds = .05, this._openingSeconds = .15, this._userTimeSeconds = 0, this._parameterIds = [], null != t && (this._parameterIds = null != (i = null == (e = t.getEyeBlinkParameters()) ? void 0 : e.slice()) ? i : this._parameterIds)
        }
        determinNextBlinkingTiming() {
            const t = Math.random();
            return this._userTimeSeconds + t * (2 * this._blinkingIntervalSeconds - 1)
        }
    };
    let oe = ae;
    oe.CloseIfZero = !0;
    var ne = (t => (t[t.EyeState_First = 0] = "EyeState_First", t[t.EyeState_Interval = 1] = "EyeState_Interval", t[t.EyeState_Closing = 2] = "EyeState_Closing", t[t.EyeState_Closed = 3] = "EyeState_Closed", t[t.EyeState_Opening = 4] = "EyeState_Opening", t))(ne || {});
    class le {
        constructor(t = 0, e = 0, i = 0, s = 0) {
            this.x = t, this.y = e, this.width = i, this.height = s
        }
        getCenterX() {
            return this.x + .5 * this.width
        }
        getCenterY() {
            return this.y + .5 * this.height
        }
        getRight() {
            return this.x + this.width
        }
        getBottom() {
            return this.y + this.height
        }
        setRect(t) {
            this.x = t.x, this.y = t.y, this.width = t.width, this.height = t.height
        }
        expand(t, e) {
            this.x -= t, this.y -= e, this.width += 2 * t, this.height += 2 * e
        }
    }
    let he, de, ue;
    class ce {
        getChannelFlagAsColor(t) {
            return this._channelColors[t]
        }
        getMaskRenderTexture() {
            let t = 0;
            if (this._maskTexture && 0 != this._maskTexture.texture && (this._maskTexture.frameNo = this._currentFrameNo, t = this._maskTexture.texture), 0 == t) {
                const e = this._clippingMaskBufferSize;
                this._colorBuffer = this.gl.createTexture(), this.gl.bindTexture(this.gl.TEXTURE_2D, this._colorBuffer), this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, e, e, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null), this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE), this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE), this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR), this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR), this.gl.bindTexture(this.gl.TEXTURE_2D, null), t = this.gl.createFramebuffer(), this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, t), this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this._colorBuffer, 0), this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, ue), this._maskTexture = new ge(this._currentFrameNo, t)
            }
            return t
        }
        setGL(t) {
            this.gl = t
        }
        calcClippedDrawTotalBounds(t, e) {
            let i = Number.MAX_VALUE,
                s = Number.MAX_VALUE,
                r = Number.MIN_VALUE,
                a = Number.MIN_VALUE;
            const o = e._clippedDrawableIndexList.length;
            for (let n = 0; n < o; n++) {
                const o = e._clippedDrawableIndexList[n],
                    l = t.getDrawableVertexCount(o),
                    h = t.getDrawableVertices(o);
                let d = Number.MAX_VALUE,
                    u = Number.MAX_VALUE,
                    c = Number.MIN_VALUE,
                    g = Number.MIN_VALUE;
                const m = l * Pt;
                for (let t = vt; t < m; t += Pt) {
                    const e = h[t],
                        i = h[t + 1];
                    e < d && (d = e), e > c && (c = e), i < u && (u = i), i > g && (g = i)
                }
                if (d != Number.MAX_VALUE)
                    if (d < i && (i = d), u < s && (s = u), c > r && (r = c), g > a && (a = g), i == Number.MAX_VALUE) e._allClippedDrawRect.x = 0, e._allClippedDrawRect.y = 0, e._allClippedDrawRect.width = 0, e._allClippedDrawRect.height = 0, e._isUsing = !1;
                    else {
                        e._isUsing = !0;
                        const t = r - i,
                            o = a - s;
                        e._allClippedDrawRect.x = i, e._allClippedDrawRect.y = s, e._allClippedDrawRect.width = t, e._allClippedDrawRect.height = o
                    }
            }
        }
        constructor() {
            this._maskRenderTexture = null, this._colorBuffer = null, this._currentFrameNo = 0, this._clippingMaskBufferSize = 256, this._clippingContextListForMask = [], this._clippingContextListForDraw = [], this._channelColors = [], this._tmpBoundsOnModel = new le, this._tmpMatrix = new mt, this._tmpMatrixForMask = new mt, this._tmpMatrixForDraw = new mt;
            let t = new ft;
            t.R = 1, t.G = 0, t.B = 0, t.A = 0, this._channelColors.push(t), t = new ft, t.R = 0, t.G = 1, t.B = 0, t.A = 0, this._channelColors.push(t), t = new ft, t.R = 0, t.G = 0, t.B = 1, t.A = 0, this._channelColors.push(t), t = new ft, t.R = 0, t.G = 0, t.B = 0, t.A = 1, this._channelColors.push(t)
        }
        release() {
            var t, e, i;
            const s = this;
            for (let r = 0; r < this._clippingContextListForMask.length; r++) this._clippingContextListForMask[r] && (null == (t = this._clippingContextListForMask[r]) || t.release());
            s._clippingContextListForMask = void 0, s._clippingContextListForDraw = void 0, this._maskTexture && (null == (e = this.gl) || e.deleteFramebuffer(this._maskTexture.texture), s._maskTexture = void 0), s._channelColors = void 0, null == (i = this.gl) || i.deleteTexture(this._colorBuffer), this._colorBuffer = null
        }
        initialize(t, e, i, s) {
            for (let r = 0; r < e; r++) {
                if (s[r] <= 0) {
                    this._clippingContextListForDraw.push(null);
                    continue
                }
                let t = this.findSameClip(i[r], s[r]);
                null == t && (t = new me(this, i[r], s[r]), this._clippingContextListForMask.push(t)), t.addClippedDrawable(r), this._clippingContextListForDraw.push(t)
            }
        }
        setupClippingContext(t, e) {
            this._currentFrameNo++;
            let i = 0;
            for (let s = 0; s < this._clippingContextListForMask.length; s++) {
                const e = this._clippingContextListForMask[s];
                this.calcClippedDrawTotalBounds(t, e), e._isUsing && i++
            }
            if (i > 0) {
                this.gl.viewport(0, 0, this._clippingMaskBufferSize, this._clippingMaskBufferSize), this._maskRenderTexture = this.getMaskRenderTexture(), e.getMvpMatrix(), e.preDraw(), this.setupLayoutBounds(i), this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this._maskRenderTexture), this.gl.clearColor(1, 1, 1, 1), this.gl.clear(this.gl.COLOR_BUFFER_BIT);
                for (let i = 0; i < this._clippingContextListForMask.length; i++) {
                    const s = this._clippingContextListForMask[i],
                        r = s._allClippedDrawRect,
                        a = s._layoutBounds,
                        o = .05;
                    this._tmpBoundsOnModel.setRect(r), this._tmpBoundsOnModel.expand(r.width * o, r.height * o);
                    const n = a.width / this._tmpBoundsOnModel.width,
                        l = a.height / this._tmpBoundsOnModel.height;
                    this._tmpMatrix.loadIdentity(), this._tmpMatrix.translateRelative(-1, -1), this._tmpMatrix.scaleRelative(2, 2), this._tmpMatrix.translateRelative(a.x, a.y), this._tmpMatrix.scaleRelative(n, l), this._tmpMatrix.translateRelative(-this._tmpBoundsOnModel.x, -this._tmpBoundsOnModel.y), this._tmpMatrixForMask.setMatrix(this._tmpMatrix.getArray()), this._tmpMatrix.loadIdentity(), this._tmpMatrix.translateRelative(a.x, a.y), this._tmpMatrix.scaleRelative(n, l), this._tmpMatrix.translateRelative(-this._tmpBoundsOnModel.x, -this._tmpBoundsOnModel.y), this._tmpMatrixForDraw.setMatrix(this._tmpMatrix.getArray()), s._matrixForMask.setMatrix(this._tmpMatrixForMask.getArray()), s._matrixForDraw.setMatrix(this._tmpMatrixForDraw.getArray());
                    const h = s._clippingIdCount;
                    for (let i = 0; i < h; i++) {
                        const r = s._clippingIdList[i];
                        t.getDrawableDynamicFlagVertexPositionsDidChange(r) && (e.setIsCulling(0 != t.getDrawableCulling(r)), e.setClippingContextBufferForMask(s), e.drawMesh(t.getDrawableTextureIndices(r), t.getDrawableVertexIndexCount(r), t.getDrawableVertexCount(r), t.getDrawableVertexIndices(r), t.getDrawableVertices(r), t.getDrawableVertexUvs(r), t.getDrawableOpacity(r), _t.CubismBlendMode_Normal, !1))
                    }
                }
                this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, ue), e.setClippingContextBufferForMask(null), this.gl.viewport(de[0], de[1], de[2], de[3])
            }
        }
        findSameClip(t, e) {
            for (let i = 0; i < this._clippingContextListForMask.length; i++) {
                const s = this._clippingContextListForMask[i],
                    r = s._clippingIdCount;
                if (r != e) continue;
                let a = 0;
                for (let e = 0; e < r; e++) {
                    const i = s._clippingIdList[e];
                    for (let e = 0; e < r; e++)
                        if (t[e] == i) {
                            a++;
                            break
                        }
                }
                if (a == r) return s
            }
            return null
        }
        setupLayoutBounds(t) {
            let e = t / 4,
                i = t % 4;
            e = ~~e, i = ~~i;
            let s = 0;
            for (let r = 0; r < 4; r++) {
                const t = e + (r < i ? 1 : 0);
                if (0 == t);
                else if (1 == t) {
                    const t = this._clippingContextListForMask[s++];
                    t._layoutChannelNo = r, t._layoutBounds.x = 0, t._layoutBounds.y = 0, t._layoutBounds.width = 1, t._layoutBounds.height = 1
                } else if (2 == t)
                    for (let e = 0; e < t; e++) {
                        let t = e % 2;
                        t = ~~t;
                        const i = this._clippingContextListForMask[s++];
                        i._layoutChannelNo = r, i._layoutBounds.x = .5 * t, i._layoutBounds.y = 0, i._layoutBounds.width = .5, i._layoutBounds.height = 1
                    } else if (t <= 4)
                        for (let e = 0; e < t; e++) {
                            let t = e % 2,
                                i = e / 2;
                            t = ~~t, i = ~~i;
                            const a = this._clippingContextListForMask[s++];
                            a._layoutChannelNo = r, a._layoutBounds.x = .5 * t, a._layoutBounds.y = .5 * i, a._layoutBounds.width = .5, a._layoutBounds.height = .5
                        } else if (t <= 9)
                            for (let e = 0; e < t; e++) {
                                let t = e % 3,
                                    i = e / 3;
                                t = ~~t, i = ~~i;
                                const a = this._clippingContextListForMask[s++];
                                a._layoutChannelNo = r, a._layoutBounds.x = t / 3, a._layoutBounds.y = i / 3, a._layoutBounds.width = 1 / 3, a._layoutBounds.height = 1 / 3
                            } else if (a.supportMoreMaskDivisions && t <= 16)
                                for (let e = 0; e < t; e++) {
                                    let t = e % 4,
                                        i = e / 4;
                                    t = ~~t, i = ~~i;
                                    const a = this._clippingContextListForMask[s++];
                                    a._layoutChannelNo = r, a._layoutBounds.x = t / 4, a._layoutBounds.y = i / 4, a._layoutBounds.width = 1 / 4, a._layoutBounds.height = 1 / 4
                                } else Tt("not supported mask count : {0}", t)
            }
        }
        getColorBuffer() {
            return this._colorBuffer
        }
        getClippingContextListForDraw() {
            return this._clippingContextListForDraw
        }
        setClippingMaskBufferSize(t) {
            this._clippingMaskBufferSize = t
        }
        getClippingMaskBufferSize() {
            return this._clippingMaskBufferSize
        }
    }
    class ge {
        constructor(t, e) {
            this.frameNo = t, this.texture = e
        }
    }
    class me {
        constructor(t, e, i) {
            this._isUsing = !1, this._owner = t, this._clippingIdList = e, this._clippingIdCount = i, this._allClippedDrawRect = new le, this._layoutBounds = new le, this._clippedDrawableIndexList = [], this._matrixForMask = new mt, this._matrixForDraw = new mt
        }
        release() {
            const t = this;
            t._layoutBounds = void 0, t._allClippedDrawRect = void 0, t._clippedDrawableIndexList = void 0
        }
        addClippedDrawable(t) {
            this._clippedDrawableIndexList.push(t)
        }
        getClippingManager() {
            return this._owner
        }
        setGl(t) {
            this._owner.setGL(t)
        }
    }
    class pe {
        static getInstance() {
            return null == he ? (he = new pe, he) : he
        }
        static deleteInstance() {
            he && (he.release(), he = void 0)
        }
        constructor() {
            this._shaderSets = []
        }
        release() {
            this.releaseShaderProgram()
        }
        setupShaderProgram(t, e, i, s, r, a, o, n, l, h, d, u, c) {
            let g, m, p, _;
            d || Tt("NoPremultipliedAlpha is not allowed"), 0 == this._shaderSets.length && this.generateShaders();
            const f = t.getClippingContextBufferForMask();
            if (null != f) {
                const t = this._shaderSets[_e.ShaderNames_SetupMask];
                this.gl.useProgram(t.shaderProgram), this.gl.activeTexture(this.gl.TEXTURE0), this.gl.bindTexture(this.gl.TEXTURE_2D, e), this.gl.uniform1i(t.samplerTexture0Location, 0), null == o.vertex && (o.vertex = this.gl.createBuffer()), this.gl.bindBuffer(this.gl.ARRAY_BUFFER, o.vertex), this.gl.bufferData(this.gl.ARRAY_BUFFER, s, this.gl.DYNAMIC_DRAW), this.gl.enableVertexAttribArray(t.attributePositionLocation), this.gl.vertexAttribPointer(t.attributePositionLocation, 2, this.gl.FLOAT, !1, 0, 0), null == o.uv && (o.uv = this.gl.createBuffer()), this.gl.bindBuffer(this.gl.ARRAY_BUFFER, o.uv), this.gl.bufferData(this.gl.ARRAY_BUFFER, a, this.gl.DYNAMIC_DRAW), this.gl.enableVertexAttribArray(t.attributeTexCoordLocation), this.gl.vertexAttribPointer(t.attributeTexCoordLocation, 2, this.gl.FLOAT, !1, 0, 0);
                const i = f._layoutChannelNo,
                    r = f.getClippingManager().getChannelFlagAsColor(i);
                this.gl.uniform4f(t.uniformChannelFlagLocation, r.R, r.G, r.B, r.A), this.gl.uniformMatrix4fv(t.uniformClipMatrixLocation, !1, f._matrixForMask.getArray());
                const n = f._layoutBounds;
                this.gl.uniform4f(t.uniformBaseColorLocation, 2 * n.x - 1, 2 * n.y - 1, 2 * n.getRight() - 1, 2 * n.getBottom() - 1), g = this.gl.ZERO, m = this.gl.ONE_MINUS_SRC_COLOR, p = this.gl.ZERO, _ = this.gl.ONE_MINUS_SRC_ALPHA
            } else {
                const i = t.getClippingContextBufferForDraw(),
                    r = null != i ? c ? 2 : 1 : 0;
                let n;
                switch (l) {
                    case _t.CubismBlendMode_Normal:
                    default:
                        n = this._shaderSets[_e.ShaderNames_NormalPremultipliedAlpha + r], g = this.gl.ONE, m = this.gl.ONE_MINUS_SRC_ALPHA, p = this.gl.ONE, _ = this.gl.ONE_MINUS_SRC_ALPHA;
                        break;
                    case _t.CubismBlendMode_Additive:
                        n = this._shaderSets[_e.ShaderNames_AddPremultipliedAlpha + r], g = this.gl.ONE, m = this.gl.ONE, p = this.gl.ZERO, _ = this.gl.ONE;
                        break;
                    case _t.CubismBlendMode_Multiplicative:
                        n = this._shaderSets[_e.ShaderNames_MultPremultipliedAlpha + r], g = this.gl.DST_COLOR, m = this.gl.ONE_MINUS_SRC_ALPHA, p = this.gl.ZERO, _ = this.gl.ONE
                }
                if (this.gl.useProgram(n.shaderProgram), null == o.vertex && (o.vertex = this.gl.createBuffer()), this.gl.bindBuffer(this.gl.ARRAY_BUFFER, o.vertex), this.gl.bufferData(this.gl.ARRAY_BUFFER, s, this.gl.DYNAMIC_DRAW), this.gl.enableVertexAttribArray(n.attributePositionLocation), this.gl.vertexAttribPointer(n.attributePositionLocation, 2, this.gl.FLOAT, !1, 0, 0), null == o.uv && (o.uv = this.gl.createBuffer()), this.gl.bindBuffer(this.gl.ARRAY_BUFFER, o.uv), this.gl.bufferData(this.gl.ARRAY_BUFFER, a, this.gl.DYNAMIC_DRAW), this.gl.enableVertexAttribArray(n.attributeTexCoordLocation), this.gl.vertexAttribPointer(n.attributeTexCoordLocation, 2, this.gl.FLOAT, !1, 0, 0), null != i) {
                    this.gl.activeTexture(this.gl.TEXTURE1);
                    const t = i.getClippingManager().getColorBuffer();
                    this.gl.bindTexture(this.gl.TEXTURE_2D, t), this.gl.uniform1i(n.samplerTexture1Location, 1), this.gl.uniformMatrix4fv(n.uniformClipMatrixLocation, !1, i._matrixForDraw.getArray());
                    const e = i._layoutChannelNo,
                        s = i.getClippingManager().getChannelFlagAsColor(e);
                    this.gl.uniform4f(n.uniformChannelFlagLocation, s.R, s.G, s.B, s.A)
                }
                this.gl.activeTexture(this.gl.TEXTURE0), this.gl.bindTexture(this.gl.TEXTURE_2D, e), this.gl.uniform1i(n.samplerTexture0Location, 0), this.gl.uniformMatrix4fv(n.uniformMatrixLocation, !1, u.getArray()), this.gl.uniform4f(n.uniformBaseColorLocation, h.R, h.G, h.B, h.A)
            }
            null == o.index && (o.index = this.gl.createBuffer()), this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, o.index), this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, r, this.gl.DYNAMIC_DRAW), this.gl.blendFuncSeparate(g, m, p, _)
        }
        releaseShaderProgram() {
            for (let t = 0; t < this._shaderSets.length; t++) this.gl.deleteProgram(this._shaderSets[t].shaderProgram), this._shaderSets[t].shaderProgram = 0;
            this._shaderSets = []
        }
        generateShaders() {
            for (let t = 0; t < 10; t++) this._shaderSets.push({});
            this._shaderSets[0].shaderProgram = this.loadShaderProgram(fe, xe), this._shaderSets[1].shaderProgram = this.loadShaderProgram(ye, ve), this._shaderSets[2].shaderProgram = this.loadShaderProgram(Me, Pe), this._shaderSets[3].shaderProgram = this.loadShaderProgram(Me, Ce), this._shaderSets[4].shaderProgram = this._shaderSets[1].shaderProgram, this._shaderSets[5].shaderProgram = this._shaderSets[2].shaderProgram, this._shaderSets[6].shaderProgram = this._shaderSets[3].shaderProgram, this._shaderSets[7].shaderProgram = this._shaderSets[1].shaderProgram, this._shaderSets[8].shaderProgram = this._shaderSets[2].shaderProgram, this._shaderSets[9].shaderProgram = this._shaderSets[3].shaderProgram, this._shaderSets[0].attributePositionLocation = this.gl.getAttribLocation(this._shaderSets[0].shaderProgram, "a_position"), this._shaderSets[0].attributeTexCoordLocation = this.gl.getAttribLocation(this._shaderSets[0].shaderProgram, "a_texCoord"), this._shaderSets[0].samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets[0].shaderProgram, "s_texture0"), this._shaderSets[0].uniformClipMatrixLocation = this.gl.getUniformLocation(this._shaderSets[0].shaderProgram, "u_clipMatrix"), this._shaderSets[0].uniformChannelFlagLocation = this.gl.getUniformLocation(this._shaderSets[0].shaderProgram, "u_channelFlag"), this._shaderSets[0].uniformBaseColorLocation = this.gl.getUniformLocation(this._shaderSets[0].shaderProgram, "u_baseColor"), this._shaderSets[1].attributePositionLocation = this.gl.getAttribLocation(this._shaderSets[1].shaderProgram, "a_position"), this._shaderSets[1].attributeTexCoordLocation = this.gl.getAttribLocation(this._shaderSets[1].shaderProgram, "a_texCoord"), this._shaderSets[1].samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets[1].shaderProgram, "s_texture0"), this._shaderSets[1].uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets[1].shaderProgram, "u_matrix"), this._shaderSets[1].uniformBaseColorLocation = this.gl.getUniformLocation(this._shaderSets[1].shaderProgram, "u_baseColor"), this._shaderSets[2].attributePositionLocation = this.gl.getAttribLocation(this._shaderSets[2].shaderProgram, "a_position"), this._shaderSets[2].attributeTexCoordLocation = this.gl.getAttribLocation(this._shaderSets[2].shaderProgram, "a_texCoord"), this._shaderSets[2].samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets[2].shaderProgram, "s_texture0"), this._shaderSets[2].samplerTexture1Location = this.gl.getUniformLocation(this._shaderSets[2].shaderProgram, "s_texture1"), this._shaderSets[2].uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets[2].shaderProgram, "u_matrix"), this._shaderSets[2].uniformClipMatrixLocation = this.gl.getUniformLocation(this._shaderSets[2].shaderProgram, "u_clipMatrix"), this._shaderSets[2].uniformChannelFlagLocation = this.gl.getUniformLocation(this._shaderSets[2].shaderProgram, "u_channelFlag"), this._shaderSets[2].uniformBaseColorLocation = this.gl.getUniformLocation(this._shaderSets[2].shaderProgram, "u_baseColor"), this._shaderSets[3].attributePositionLocation = this.gl.getAttribLocation(this._shaderSets[3].shaderProgram, "a_position"), this._shaderSets[3].attributeTexCoordLocation = this.gl.getAttribLocation(this._shaderSets[3].shaderProgram, "a_texCoord"), this._shaderSets[3].samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets[3].shaderProgram, "s_texture0"), this._shaderSets[3].samplerTexture1Location = this.gl.getUniformLocation(this._shaderSets[3].shaderProgram, "s_texture1"), this._shaderSets[3].uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets[3].shaderProgram, "u_matrix"), this._shaderSets[3].uniformClipMatrixLocation = this.gl.getUniformLocation(this._shaderSets[3].shaderProgram, "u_clipMatrix"), this._shaderSets[3].uniformChannelFlagLocation = this.gl.getUniformLocation(this._shaderSets[3].shaderProgram, "u_channelFlag"), this._shaderSets[3].uniformBaseColorLocation = this.gl.getUniformLocation(this._shaderSets[3].shaderProgram, "u_baseColor"), this._shaderSets[4].attributePositionLocation = this.gl.getAttribLocation(this._shaderSets[4].shaderProgram, "a_position"), this._shaderSets[4].attributeTexCoordLocation = this.gl.getAttribLocation(this._shaderSets[4].shaderProgram, "a_texCoord"), this._shaderSets[4].samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets[4].shaderProgram, "s_texture0"), this._shaderSets[4].uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets[4].shaderProgram, "u_matrix"), this._shaderSets[4].uniformBaseColorLocation = this.gl.getUniformLocation(this._shaderSets[4].shaderProgram, "u_baseColor"), this._shaderSets[5].attributePositionLocation = this.gl.getAttribLocation(this._shaderSets[5].shaderProgram, "a_position"), this._shaderSets[5].attributeTexCoordLocation = this.gl.getAttribLocation(this._shaderSets[5].shaderProgram, "a_texCoord"), this._shaderSets[5].samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets[5].shaderProgram, "s_texture0"), this._shaderSets[5].samplerTexture1Location = this.gl.getUniformLocation(this._shaderSets[5].shaderProgram, "s_texture1"), this._shaderSets[5].uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets[5].shaderProgram, "u_matrix"), this._shaderSets[5].uniformClipMatrixLocation = this.gl.getUniformLocation(this._shaderSets[5].shaderProgram, "u_clipMatrix"), this._shaderSets[5].uniformChannelFlagLocation = this.gl.getUniformLocation(this._shaderSets[5].shaderProgram, "u_channelFlag"), this._shaderSets[5].uniformBaseColorLocation = this.gl.getUniformLocation(this._shaderSets[5].shaderProgram, "u_baseColor"), this._shaderSets[6].attributePositionLocation = this.gl.getAttribLocation(this._shaderSets[6].shaderProgram, "a_position"), this._shaderSets[6].attributeTexCoordLocation = this.gl.getAttribLocation(this._shaderSets[6].shaderProgram, "a_texCoord"), this._shaderSets[6].samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets[6].shaderProgram, "s_texture0"), this._shaderSets[6].samplerTexture1Location = this.gl.getUniformLocation(this._shaderSets[6].shaderProgram, "s_texture1"), this._shaderSets[6].uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets[6].shaderProgram, "u_matrix"), this._shaderSets[6].uniformClipMatrixLocation = this.gl.getUniformLocation(this._shaderSets[6].shaderProgram, "u_clipMatrix"), this._shaderSets[6].uniformChannelFlagLocation = this.gl.getUniformLocation(this._shaderSets[6].shaderProgram, "u_channelFlag"), this._shaderSets[6].uniformBaseColorLocation = this.gl.getUniformLocation(this._shaderSets[6].shaderProgram, "u_baseColor"), this._shaderSets[7].attributePositionLocation = this.gl.getAttribLocation(this._shaderSets[7].shaderProgram, "a_position"), this._shaderSets[7].attributeTexCoordLocation = this.gl.getAttribLocation(this._shaderSets[7].shaderProgram, "a_texCoord"), this._shaderSets[7].samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets[7].shaderProgram, "s_texture0"), this._shaderSets[7].uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets[7].shaderProgram, "u_matrix"), this._shaderSets[7].uniformBaseColorLocation = this.gl.getUniformLocation(this._shaderSets[7].shaderProgram, "u_baseColor"), this._shaderSets[8].attributePositionLocation = this.gl.getAttribLocation(this._shaderSets[8].shaderProgram, "a_position"), this._shaderSets[8].attributeTexCoordLocation = this.gl.getAttribLocation(this._shaderSets[8].shaderProgram, "a_texCoord"), this._shaderSets[8].samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets[8].shaderProgram, "s_texture0"), this._shaderSets[8].samplerTexture1Location = this.gl.getUniformLocation(this._shaderSets[8].shaderProgram, "s_texture1"), this._shaderSets[8].uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets[8].shaderProgram, "u_matrix"), this._shaderSets[8].uniformClipMatrixLocation = this.gl.getUniformLocation(this._shaderSets[8].shaderProgram, "u_clipMatrix"), this._shaderSets[8].uniformChannelFlagLocation = this.gl.getUniformLocation(this._shaderSets[8].shaderProgram, "u_channelFlag"), this._shaderSets[8].uniformBaseColorLocation = this.gl.getUniformLocation(this._shaderSets[8].shaderProgram, "u_baseColor"), this._shaderSets[9].attributePositionLocation = this.gl.getAttribLocation(this._shaderSets[9].shaderProgram, "a_position"), this._shaderSets[9].attributeTexCoordLocation = this.gl.getAttribLocation(this._shaderSets[9].shaderProgram, "a_texCoord"), this._shaderSets[9].samplerTexture0Location = this.gl.getUniformLocation(this._shaderSets[9].shaderProgram, "s_texture0"), this._shaderSets[9].samplerTexture1Location = this.gl.getUniformLocation(this._shaderSets[9].shaderProgram, "s_texture1"), this._shaderSets[9].uniformMatrixLocation = this.gl.getUniformLocation(this._shaderSets[9].shaderProgram, "u_matrix"), this._shaderSets[9].uniformClipMatrixLocation = this.gl.getUniformLocation(this._shaderSets[9].shaderProgram, "u_clipMatrix"), this._shaderSets[9].uniformChannelFlagLocation = this.gl.getUniformLocation(this._shaderSets[9].shaderProgram, "u_channelFlag"), this._shaderSets[9].uniformBaseColorLocation = this.gl.getUniformLocation(this._shaderSets[9].shaderProgram, "u_baseColor")
        }
        loadShaderProgram(t, e) {
            let i = this.gl.createProgram(),
                s = this.compileShaderSource(this.gl.VERTEX_SHADER, t);
            if (!s) return Tt("Vertex shader compile error!"), 0;
            let r = this.compileShaderSource(this.gl.FRAGMENT_SHADER, e);
            if (!r) return Tt("Vertex shader compile error!"), 0;
            this.gl.attachShader(i, s), this.gl.attachShader(i, r), this.gl.linkProgram(i);
            return this.gl.getProgramParameter(i, this.gl.LINK_STATUS) ? (this.gl.deleteShader(s), this.gl.deleteShader(r), i) : (Tt("Failed to link program: {0}", i), this.gl.deleteShader(s), this.gl.deleteShader(r), i && this.gl.deleteProgram(i), 0)
        }
        compileShaderSource(t, e) {
            const i = e,
                s = this.gl.createShader(t);
            if (this.gl.shaderSource(s, i), this.gl.compileShader(s), !s) {
                Tt("Shader compile log: {0} ", this.gl.getShaderInfoLog(s))
            }
            return this.gl.getShaderParameter(s, this.gl.COMPILE_STATUS) ? s : (this.gl.deleteShader(s), null)
        }
        setGl(t) {
            this.gl = t
        }
    }
    var _e = (t => (t[t.ShaderNames_SetupMask = 0] = "ShaderNames_SetupMask", t[t.ShaderNames_NormalPremultipliedAlpha = 1] = "ShaderNames_NormalPremultipliedAlpha", t[t.ShaderNames_NormalMaskedPremultipliedAlpha = 2] = "ShaderNames_NormalMaskedPremultipliedAlpha", t[t.ShaderNames_NomralMaskedInvertedPremultipliedAlpha = 3] = "ShaderNames_NomralMaskedInvertedPremultipliedAlpha", t[t.ShaderNames_AddPremultipliedAlpha = 4] = "ShaderNames_AddPremultipliedAlpha", t[t.ShaderNames_AddMaskedPremultipliedAlpha = 5] = "ShaderNames_AddMaskedPremultipliedAlpha", t[t.ShaderNames_AddMaskedPremultipliedAlphaInverted = 6] = "ShaderNames_AddMaskedPremultipliedAlphaInverted", t[t.ShaderNames_MultPremultipliedAlpha = 7] = "ShaderNames_MultPremultipliedAlpha", t[t.ShaderNames_MultMaskedPremultipliedAlpha = 8] = "ShaderNames_MultMaskedPremultipliedAlpha", t[t.ShaderNames_MultMaskedPremultipliedAlphaInverted = 9] = "ShaderNames_MultMaskedPremultipliedAlphaInverted", t))(_e || {});
    const fe = "attribute vec4     a_position;attribute vec2     a_texCoord;varying vec2       v_texCoord;varying vec4       v_myPos;uniform mat4       u_clipMatrix;void main(){   gl_Position = u_clipMatrix * a_position;   v_myPos = u_clipMatrix * a_position;   v_texCoord = a_texCoord;   v_texCoord.y = 1.0 - v_texCoord.y;}",
        xe = "precision mediump float;varying vec2       v_texCoord;varying vec4       v_myPos;uniform vec4       u_baseColor;uniform vec4       u_channelFlag;uniform sampler2D  s_texture0;void main(){   float isInside =        step(u_baseColor.x, v_myPos.x/v_myPos.w)       * step(u_baseColor.y, v_myPos.y/v_myPos.w)       * step(v_myPos.x/v_myPos.w, u_baseColor.z)       * step(v_myPos.y/v_myPos.w, u_baseColor.w);   gl_FragColor = u_channelFlag * texture2D(s_texture0, v_texCoord).a * isInside;}",
        ye = "attribute vec4     a_position;attribute vec2     a_texCoord;varying vec2       v_texCoord;uniform mat4       u_matrix;void main(){   gl_Position = u_matrix * a_position;   v_texCoord = a_texCoord;   v_texCoord.y = 1.0 - v_texCoord.y;}",
        Me = "attribute vec4     a_position;attribute vec2     a_texCoord;varying vec2       v_texCoord;varying vec4       v_clipPos;uniform mat4       u_matrix;uniform mat4       u_clipMatrix;void main(){   gl_Position = u_matrix * a_position;   v_clipPos = u_clipMatrix * a_position;   v_texCoord = a_texCoord;   v_texCoord.y = 1.0 - v_texCoord.y;}",
        ve = "precision mediump float;varying vec2       v_texCoord;uniform vec4       u_baseColor;uniform sampler2D  s_texture0;void main(){   gl_FragColor = texture2D(s_texture0 , v_texCoord) * u_baseColor;}",
        Pe = "precision mediump float;varying vec2       v_texCoord;varying vec4       v_clipPos;uniform vec4       u_baseColor;uniform vec4       u_channelFlag;uniform sampler2D  s_texture0;uniform sampler2D  s_texture1;void main(){   vec4 col_formask = texture2D(s_texture0 , v_texCoord) * u_baseColor;   vec4 clipMask = (1.0 - texture2D(s_texture1, v_clipPos.xy / v_clipPos.w)) * u_channelFlag;   float maskVal = clipMask.r + clipMask.g + clipMask.b + clipMask.a;   col_formask = col_formask * maskVal;   gl_FragColor = col_formask;}",
        Ce = "precision mediump float;varying vec2 v_texCoord;varying vec4 v_clipPos;uniform sampler2D s_texture0;uniform sampler2D s_texture1;uniform vec4 u_channelFlag;uniform vec4 u_baseColor;void main(){vec4 col_formask = texture2D(s_texture0, v_texCoord) * u_baseColor;vec4 clipMask = (1.0 - texture2D(s_texture1, v_clipPos.xy / v_clipPos.w)) * u_channelFlag;float maskVal = clipMask.r + clipMask.g + clipMask.b + clipMask.a;col_formask = col_formask * (1.0 - maskVal);gl_FragColor = col_formask;}";
    class Se extends pt {
        constructor() {
            super(), this._clippingContextBufferForMask = null, this._clippingContextBufferForDraw = null, this._clippingManager = new ce, this.firstDraw = !0, this._textures = {}, this._sortedDrawableIndexList = [], this._bufferData = {
                vertex: null,
                uv: null,
                index: null
            }
        }
        initialize(t) {
            t.isUsingMasking() && (this._clippingManager = new ce, this._clippingManager.initialize(t, t.getDrawableCount(), t.getDrawableMasks(), t.getDrawableMaskCounts()));
            for (let e = t.getDrawableCount() - 1; e >= 0; e--) this._sortedDrawableIndexList[e] = 0;
            super.initialize(t)
        }
        bindTexture(t, e) {
            this._textures[t] = e
        }
        getBindedTextures() {
            return this._textures
        }
        setClippingMaskBufferSize(t) {
            this._clippingManager.release(), this._clippingManager = new ce, this._clippingManager.setClippingMaskBufferSize(t), this._clippingManager.initialize(this.getModel(), this.getModel().getDrawableCount(), this.getModel().getDrawableMasks(), this.getModel().getDrawableMaskCounts())
        }
        getClippingMaskBufferSize() {
            return this._clippingManager.getClippingMaskBufferSize()
        }
        release() {
            var t, e, i;
            const s = this;
            this._clippingManager.release(), s._clippingManager = void 0, null == (t = this.gl) || t.deleteBuffer(this._bufferData.vertex), this._bufferData.vertex = null, null == (e = this.gl) || e.deleteBuffer(this._bufferData.uv), this._bufferData.uv = null, null == (i = this.gl) || i.deleteBuffer(this._bufferData.index), this._bufferData.index = null, s._bufferData = void 0, s._textures = void 0
        }
        doDrawModel() {
            this.preDraw(), null != this._clippingManager && this._clippingManager.setupClippingContext(this.getModel(), this);
            const t = this.getModel().getDrawableCount(),
                e = this.getModel().getDrawableRenderOrders();
            for (let i = 0; i < t; ++i) {
                const t = e[i];
                this._sortedDrawableIndexList[t] = i
            }
            for (let i = 0; i < t; ++i) {
                const t = this._sortedDrawableIndexList[i];
                this.getModel().getDrawableDynamicFlagIsVisible(t) && (this.setClippingContextBufferForDraw(null != this._clippingManager ? this._clippingManager.getClippingContextListForDraw()[t] : null), this.setIsCulling(this.getModel().getDrawableCulling(t)), this.drawMesh(this.getModel().getDrawableTextureIndices(t), this.getModel().getDrawableVertexIndexCount(t), this.getModel().getDrawableVertexCount(t), this.getModel().getDrawableVertexIndices(t), this.getModel().getDrawableVertices(t), this.getModel().getDrawableVertexUvs(t), this.getModel().getDrawableOpacity(t), this.getModel().getDrawableBlendMode(t), this.getModel().getDrawableInvertedMaskBit(t)))
            }
        }
        drawMesh(t, e, i, s, r, a, o, n, l) {
            this.isCulling() ? this.gl.enable(this.gl.CULL_FACE) : this.gl.disable(this.gl.CULL_FACE), this.gl.frontFace(this.gl.CCW);
            const h = this.getModelColor();
            null == this.getClippingContextBufferForMask() && (h.A *= o, this.isPremultipliedAlpha() && (h.R *= h.A, h.G *= h.A, h.B *= h.A));
            let d = null;
            null != this._textures[t] && (d = this._textures[t]), pe.getInstance().setupShaderProgram(this, d, i, r, s, a, this._bufferData, o, n, h, this.isPremultipliedAlpha(), this.getMvpMatrix(), l), this.gl.drawElements(this.gl.TRIANGLES, e, this.gl.UNSIGNED_SHORT, 0), this.gl.useProgram(null), this.setClippingContextBufferForDraw(null), this.setClippingContextBufferForMask(null)
        }
        static doStaticRelease() {
            pe.deleteInstance()
        }
        setRenderState(t, e) {
            ue = t, de = e
        }
        preDraw() {
            this.firstDraw && (this.firstDraw = !1, this._anisortopy = this.gl.getExtension("EXT_texture_filter_anisotropic") || this.gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic") || this.gl.getExtension("MOZ_EXT_texture_filter_anisotropic")), this.gl.disable(this.gl.SCISSOR_TEST), this.gl.disable(this.gl.STENCIL_TEST), this.gl.disable(this.gl.DEPTH_TEST), this.gl.frontFace(this.gl.CW), this.gl.enable(this.gl.BLEND), this.gl.colorMask(!0, !0, !0, !0), this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null), this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null)
        }
        setClippingContextBufferForMask(t) {
            this._clippingContextBufferForMask = t
        }
        getClippingContextBufferForMask() {
            return this._clippingContextBufferForMask
        }
        setClippingContextBufferForDraw(t) {
            this._clippingContextBufferForDraw = t
        }
        getClippingContextBufferForDraw() {
            return this._clippingContextBufferForDraw
        }
        startUp(t) {
            this.gl = t, this._clippingManager.setGL(t), pe.getInstance().setGl(t)
        }
    }
    pt.staticRelease = () => {
        Se.doStaticRelease()
    };
    const be = new mt;
    class Ie extends b {
        constructor(t, e, s) {
            super(), this.lipSync = !0, this.breath = se.create(), this.renderer = new Se, this.idParamAngleX = "ParamAngleX", this.idParamAngleY = "ParamAngleY", this.idParamAngleZ = "ParamAngleZ", this.idParamEyeBallX = "ParamEyeBallX", this.idParamEyeBallY = "ParamEyeBallY", this.idParamBodyAngleX = "ParamBodyAngleX", this.idParamBreath = "ParamBreath", this.pixelsPerUnit = 1, this.centeringTransform = new i.Matrix, this.coreModel = t, this.settings = e, this.motionManager = new ie(e, s), this.init()
        }
        init() {
            var t;
            super.init(), (null == (t = this.settings.getEyeBlinkParameters()) ? void 0 : t.length) > 0 && (this.eyeBlink = oe.create(this.settings)), this.breath.setParameters([new re(this.idParamAngleX, 0, 15, 6.5345, .5), new re(this.idParamAngleY, 0, 8, 3.5345, .5), new re(this.idParamAngleZ, 0, 10, 5.5345, .5), new re(this.idParamBodyAngleX, 0, 4, 15.5345, .5), new re(this.idParamBreath, 0, .5, 3.2345, .5)]), this.renderer.initialize(this.coreModel), this.renderer.setIsPremultipliedAlpha(!0)
        }
        getSize() {
            return [this.coreModel.getModel().canvasinfo.CanvasWidth, this.coreModel.getModel().canvasinfo.CanvasHeight]
        }
        getLayout() {
            const t = {};
            if (this.settings.layout)
                for (const e of Object.keys(this.settings.layout)) {
                    t[e.charAt(0).toLowerCase() + e.slice(1)] = this.settings.layout[e]
                }
            return t
        }
        setupLayout() {
            super.setupLayout(), this.pixelsPerUnit = this.coreModel.getModel().canvasinfo.PixelsPerUnit, this.centeringTransform.scale(this.pixelsPerUnit, this.pixelsPerUnit).translate(this.originalWidth / 2, this.originalHeight / 2)
        }
        updateWebGLContext(t, e) {
            this.renderer.firstDraw = !0, this.renderer._bufferData = {
                vertex: null,
                uv: null,
                index: null
            }, this.renderer.startUp(t), this.renderer._clippingManager._currentFrameNo = e, this.renderer._clippingManager._maskTexture = void 0, pe.getInstance()._shaderSets = []
        }
        bindTexture(t, e) {
            this.renderer.bindTexture(t, e)
        }
        getHitAreaDefs() {
            var t, e;
            return null != (e = null == (t = this.settings.hitAreas) ? void 0 : t.map((t => ({
                id: t.Id,
                name: t.Name,
                index: this.coreModel.getDrawableIndex(t.Id)
            })))) ? e : []
        }
        getDrawableIDs() {
            return this.coreModel.getDrawableIds()
        }
        getDrawableIndex(t) {
            return this.coreModel.getDrawableIndex(t)
        }
        getDrawableVertices(t) {
            if ("string" == typeof t && -1 === (t = this.coreModel.getDrawableIndex(t))) throw new TypeError("Unable to find drawable ID: " + t);
            const e = this.coreModel.getDrawableVertices(t).slice();
            for (let i = 0; i < e.length; i += 2) e[i] = e[i] * this.pixelsPerUnit + this.originalWidth / 2, e[i + 1] = -e[i + 1] * this.pixelsPerUnit + this.originalHeight / 2;
            return e
        }
        updateTransform(t) {
            this.drawingMatrix.copyFrom(this.centeringTransform).prepend(this.localTransform).prepend(t)
        }
        update(t, e) {
            var i, s, r, a;
            super.update(t, e), t /= 1e3, e /= 1e3;
            const o = this.coreModel;
            this.emit("beforeMotionUpdate");
            const n = this.motionManager.update(this.coreModel, e);
            this.emit("afterMotionUpdate"), o.saveParameters(), null == (i = this.motionManager.expressionManager) || i.update(o, e), n || null == (s = this.eyeBlink) || s.updateParameters(o, t), this.updateFocus(), this.updateNaturalMovements(1e3 * t, 1e3 * e), null == (r = this.physics) || r.evaluate(o, t), null == (a = this.pose) || a.updateParameters(o, t), this.emit("beforeModelUpdate"), o.update(), o.loadParameters()
        }
        updateFocus() {
            this.coreModel.addParameterValueById(this.idParamEyeBallX, this.focusController.x), this.coreModel.addParameterValueById(this.idParamEyeBallY, this.focusController.y), this.coreModel.addParameterValueById(this.idParamAngleX, 30 * this.focusController.x), this.coreModel.addParameterValueById(this.idParamAngleY, 30 * this.focusController.y), this.coreModel.addParameterValueById(this.idParamAngleZ, this.focusController.x * this.focusController.y * -30), this.coreModel.addParameterValueById(this.idParamBodyAngleX, 10 * this.focusController.x)
        }
        updateNaturalMovements(t, e) {
            var i;
            null == (i = this.breath) || i.updateParameters(this.coreModel, t / 1e3)
        }
        draw(t) {
            const e = this.drawingMatrix,
                i = be.getArray();
            i[0] = e.a, i[1] = e.b, i[4] = -e.c, i[5] = -e.d, i[12] = e.tx, i[13] = e.ty, this.renderer.setMvpMatrix(be), this.renderer.setRenderState(t.getParameter(t.FRAMEBUFFER_BINDING), this.viewport), this.renderer.drawModel()
        }
        destroy() {
            super.destroy(), this.renderer.release(), this.coreModel.release(), this.renderer = void 0, this.coreModel = void 0
        }
    }
    let we, Te = 20;

    function Le() {
        return Ct.isStarted() ? Promise.resolve() : (null != we || (we = new Promise(((t, e) => {
            ! function i() {
                try {
                    Ee(), t()
                } catch (s) {
                    if (Te--, Te < 0) {
                        const t = new Error("Failed to start up Cubism 4 framework.");
                        return t.cause = s, void e(t)
                    }
                    l.log("Cubism4", "Startup failed, retrying 10ms later..."), setTimeout(i, 10)
                }
            }()
        }))), we)
    }

    function Ee(t) {
        t = Object.assign({
            logFunction: console.log,
            loggingLevel: St.LogLevel_Verbose
        }, t), Ct.startUp(t), Ct.initialize()
    }
    class Fe {
        static create(t) {
            const e = new Fe;
            "number" == typeof t.FadeInTime && (e._fadeTimeSeconds = t.FadeInTime, e._fadeTimeSeconds <= 0 && (e._fadeTimeSeconds = .5));
            const i = t.Groups,
                s = i.length;
            for (let r = 0; r < s; ++r) {
                const t = i[r],
                    s = t.length;
                let a = 0;
                for (let i = 0; i < s; ++i) {
                    const s = t[i],
                        r = new De;
                    r.partId = s.Id;
                    const o = s.Link;
                    if (o) {
                        const t = o.length;
                        for (let e = 0; e < t; ++e) {
                            const t = new De;
                            t.partId = o[e], r.link.push(t)
                        }
                    }
                    e._partGroups.push(r), ++a
                }
                e._partGroupCounts.push(a)
            }
            return e
        }
        updateParameters(t, e) {
            t != this._lastModel && this.reset(t), this._lastModel = t, e < 0 && (e = 0);
            let i = 0;
            for (let s = 0; s < this._partGroupCounts.length; s++) {
                const r = this._partGroupCounts[s];
                this.doFade(t, e, i, r), i += r
            }
            this.copyPartOpacities(t)
        }
        reset(t) {
            let e = 0;
            for (let i = 0; i < this._partGroupCounts.length; ++i) {
                const s = this._partGroupCounts[i];
                for (let i = e; i < e + s; ++i) {
                    this._partGroups[i].initialize(t);
                    const s = this._partGroups[i].partIndex,
                        r = this._partGroups[i].parameterIndex;
                    if (!(s < 0)) {
                        t.setPartOpacityByIndex(s, i == e ? 1 : 0), t.setParameterValueByIndex(r, i == e ? 1 : 0);
                        for (let e = 0; e < this._partGroups[i].link.length; ++e) this._partGroups[i].link[e].initialize(t)
                    }
                }
                e += s
            }
        }
        copyPartOpacities(t) {
            for (let e = 0; e < this._partGroups.length; ++e) {
                const i = this._partGroups[e];
                if (0 == i.link.length) continue;
                const s = this._partGroups[e].partIndex,
                    r = t.getPartOpacityByIndex(s);
                for (let e = 0; e < i.link.length; ++e) {
                    const s = i.link[e].partIndex;
                    s < 0 || t.setPartOpacityByIndex(s, r)
                }
            }
        }
        doFade(t, e, i, s) {
            let r = -1,
                a = 1;
            const o = .5;
            for (let n = i; n < i + s; ++n) {
                const i = this._partGroups[n].partIndex,
                    s = this._partGroups[n].parameterIndex;
                if (t.getParameterValueByIndex(s) > .001) {
                    if (r >= 0) break;
                    r = n, a = t.getPartOpacityByIndex(i), a += e / this._fadeTimeSeconds, a > 1 && (a = 1)
                }
            }
            r < 0 && (r = 0, a = 1);
            for (let n = i; n < i + s; ++n) {
                const e = this._partGroups[n].partIndex;
                if (r == n) t.setPartOpacityByIndex(e, a);
                else {
                    let i, s = t.getPartOpacityByIndex(e);
                    i = a < o ? -.5 * a / o + 1 : (1 - a) * o / .5;
                    (1 - i) * (1 - a) > .15 && (i = 1 - .15 / (1 - a)), s > i && (s = i), t.setPartOpacityByIndex(e, s)
                }
            }
        }
        constructor() {
            this._fadeTimeSeconds = .5, this._lastModel = void 0, this._partGroups = [], this._partGroupCounts = []
        }
    }
    class De {
        constructor(t) {
            this.parameterIndex = 0, this.partIndex = 0, this.partId = "", this.link = [], null != t && this.assignment(t)
        }
        assignment(t) {
            return this.partId = t.partId, this.link = t.link.map((t => t.clone())), this
        }
        initialize(t) {
            this.parameterIndex = t.getParameterIndex(this.partId), this.partIndex = t.getPartIndex(this.partId), t.setParameterValueByIndex(this.parameterIndex, 1)
        }
        clone() {
            const t = new De;
            return t.partId = this.partId, t.parameterIndex = this.parameterIndex, t.partIndex = this.partIndex, t.link = this.link.map((t => t.clone())), t
        }
    }
    class Ae {
        update() {
            this._model.update(), this._model.drawables.resetDynamicFlags()
        }
        getCanvasWidth() {
            return null == this._model ? 0 : this._model.canvasinfo.CanvasWidth / this._model.canvasinfo.PixelsPerUnit
        }
        getCanvasHeight() {
            return null == this._model ? 0 : this._model.canvasinfo.CanvasHeight / this._model.canvasinfo.PixelsPerUnit
        }
        saveParameters() {
            const t = this._model.parameters.count,
                e = this._savedParameters.length;
            for (let i = 0; i < t; ++i) i < e ? this._savedParameters[i] = this._parameterValues[i] : this._savedParameters.push(this._parameterValues[i])
        }
        getModel() {
            return this._model
        }
        getPartIndex(t) {
            let e;
            const i = this._model.parts.count;
            for (e = 0; e < i; ++e)
                if (t == this._partIds[e]) return e;
            return t in this._notExistPartId ? this._notExistPartId[t] : (e = i + this._notExistPartId.length, this._notExistPartId[t] = e, this._notExistPartOpacities[e] = 0, e)
        }
        getPartCount() {
            return this._model.parts.count
        }
        setPartOpacityByIndex(t, e) {
            t in this._notExistPartOpacities ? this._notExistPartOpacities[t] = e : (0 <= t && this.getPartCount(), this._partOpacities[t] = e)
        }
        setPartOpacityById(t, e) {
            const i = this.getPartIndex(t);
            i < 0 || this.setPartOpacityByIndex(i, e)
        }
        getPartOpacityByIndex(t) {
            return t in this._notExistPartOpacities ? this._notExistPartOpacities[t] : (0 <= t && this.getPartCount(), this._partOpacities[t])
        }
        getPartOpacityById(t) {
            const e = this.getPartIndex(t);
            return e < 0 ? 0 : this.getPartOpacityByIndex(e)
        }
        getParameterIndex(t) {
            let e;
            const i = this._model.parameters.count;
            for (e = 0; e < i; ++e)
                if (t == this._parameterIds[e]) return e;
            return t in this._notExistParameterId ? this._notExistParameterId[t] : (e = this._model.parameters.count + Object.keys(this._notExistParameterId).length, this._notExistParameterId[t] = e, this._notExistParameterValues[e] = 0, e)
        }
        getParameterCount() {
            return this._model.parameters.count
        }
        getParameterMaximumValue(t) {
            return this._model.parameters.maximumValues[t]
        }
        getParameterMinimumValue(t) {
            return this._model.parameters.minimumValues[t]
        }
        getParameterDefaultValue(t) {
            return this._model.parameters.defaultValues[t]
        }
        getParameterValueByIndex(t) {
            return t in this._notExistParameterValues ? this._notExistParameterValues[t] : (0 <= t && this.getParameterCount(), this._parameterValues[t])
        }
        getParameterValueById(t) {
            const e = this.getParameterIndex(t);
            return this.getParameterValueByIndex(e)
        }
        setParameterValueByIndex(t, e, i = 1) {
            t in this._notExistParameterValues ? this._notExistParameterValues[t] = 1 == i ? e : this._notExistParameterValues[t] * (1 - i) + e * i : (0 <= t && this.getParameterCount(), this._model.parameters.maximumValues[t] < e && (e = this._model.parameters.maximumValues[t]), this._model.parameters.minimumValues[t] > e && (e = this._model.parameters.minimumValues[t]), this._parameterValues[t] = 1 == i ? e : this._parameterValues[t] = this._parameterValues[t] * (1 - i) + e * i)
        }
        setParameterValueById(t, e, i = 1) {
            const s = this.getParameterIndex(t);
            this.setParameterValueByIndex(s, e, i)
        }
        addParameterValueByIndex(t, e, i = 1) {
            this.setParameterValueByIndex(t, this.getParameterValueByIndex(t) + e * i)
        }
        addParameterValueById(t, e, i = 1) {
            const s = this.getParameterIndex(t);
            this.addParameterValueByIndex(s, e, i)
        }
        multiplyParameterValueById(t, e, i = 1) {
            const s = this.getParameterIndex(t);
            this.multiplyParameterValueByIndex(s, e, i)
        }
        multiplyParameterValueByIndex(t, e, i = 1) {
            this.setParameterValueByIndex(t, this.getParameterValueByIndex(t) * (1 + (e - 1) * i))
        }
        getDrawableIds() {
            return this._drawableIds.slice()
        }
        getDrawableIndex(t) {
            const e = this._model.drawables.count;
            for (let i = 0; i < e; ++i)
                if (this._drawableIds[i] == t) return i;
            return -1
        }
        getDrawableCount() {
            return this._model.drawables.count
        }
        getDrawableId(t) {
            return this._model.drawables.ids[t]
        }
        getDrawableRenderOrders() {
            return this._model.drawables.renderOrders
        }
        getDrawableTextureIndices(t) {
            return this._model.drawables.textureIndices[t]
        }
        getDrawableDynamicFlagVertexPositionsDidChange(t) {
            const e = this._model.drawables.dynamicFlags;
            return Live2DCubismCore.Utils.hasVertexPositionsDidChangeBit(e[t])
        }
        getDrawableVertexIndexCount(t) {
            return this._model.drawables.indexCounts[t]
        }
        getDrawableVertexCount(t) {
            return this._model.drawables.vertexCounts[t]
        }
        getDrawableVertices(t) {
            return this.getDrawableVertexPositions(t)
        }
        getDrawableVertexIndices(t) {
            return this._model.drawables.indices[t]
        }
        getDrawableVertexPositions(t) {
            return this._model.drawables.vertexPositions[t]
        }
        getDrawableVertexUvs(t) {
            return this._model.drawables.vertexUvs[t]
        }
        getDrawableOpacity(t) {
            return this._model.drawables.opacities[t]
        }
        getDrawableCulling(t) {
            const e = this._model.drawables.constantFlags;
            return !Live2DCubismCore.Utils.hasIsDoubleSidedBit(e[t])
        }
        getDrawableBlendMode(t) {
            const e = this._model.drawables.constantFlags;
            return Live2DCubismCore.Utils.hasBlendAdditiveBit(e[t]) ? _t.CubismBlendMode_Additive : Live2DCubismCore.Utils.hasBlendMultiplicativeBit(e[t]) ? _t.CubismBlendMode_Multiplicative : _t.CubismBlendMode_Normal
        }
        getDrawableInvertedMaskBit(t) {
            const e = this._model.drawables.constantFlags;
            return Live2DCubismCore.Utils.hasIsInvertedMaskBit(e[t])
        }
        getDrawableMasks() {
            return this._model.drawables.masks
        }
        getDrawableMaskCounts() {
            return this._model.drawables.maskCounts
        }
        isUsingMasking() {
            for (let t = 0; t < this._model.drawables.count; ++t)
                if (!(this._model.drawables.maskCounts[t] <= 0)) return !0;
            return !1
        }
        getDrawableDynamicFlagIsVisible(t) {
            const e = this._model.drawables.dynamicFlags;
            return Live2DCubismCore.Utils.hasIsVisibleBit(e[t])
        }
        getDrawableDynamicFlagVisibilityDidChange(t) {
            const e = this._model.drawables.dynamicFlags;
            return Live2DCubismCore.Utils.hasVisibilityDidChangeBit(e[t])
        }
        getDrawableDynamicFlagOpacityDidChange(t) {
            const e = this._model.drawables.dynamicFlags;
            return Live2DCubismCore.Utils.hasOpacityDidChangeBit(e[t])
        }
        getDrawableDynamicFlagRenderOrderDidChange(t) {
            const e = this._model.drawables.dynamicFlags;
            return Live2DCubismCore.Utils.hasRenderOrderDidChangeBit(e[t])
        }
        loadParameters() {
            let t = this._model.parameters.count;
            const e = this._savedParameters.length;
            t > e && (t = e);
            for (let i = 0; i < t; ++i) this._parameterValues[i] = this._savedParameters[i]
        }
        initialize() {
            this._parameterValues = this._model.parameters.values, this._partOpacities = this._model.parts.opacities, this._parameterMaximumValues = this._model.parameters.maximumValues, this._parameterMinimumValues = this._model.parameters.minimumValues;
            {
                const t = this._model.parameters.ids,
                    e = this._model.parameters.count;
                for (let i = 0; i < e; ++i) this._parameterIds.push(t[i])
            } {
                const t = this._model.parts.ids,
                    e = this._model.parts.count;
                for (let i = 0; i < e; ++i) this._partIds.push(t[i])
            } {
                const t = this._model.drawables.ids,
                    e = this._model.drawables.count;
                for (let i = 0; i < e; ++i) this._drawableIds.push(t[i])
            }
        }
        constructor(t) {
            this._model = t, this._savedParameters = [], this._parameterIds = [], this._drawableIds = [], this._partIds = [], this._notExistPartId = {}, this._notExistParameterId = {}, this._notExistParameterValues = {}, this._notExistPartOpacities = {}, this.initialize()
        }
        release() {
            this._model.release(), this._model = void 0
        }
    }
    class Be {
        static create(t) {
            const e = Live2DCubismCore.Moc.fromArrayBuffer(t);
            if (e) return new Be(e);
            throw new Error("Unknown error")
        }
        createModel() {
            let t;
            const e = Live2DCubismCore.Model.fromMoc(this._moc);
            if (e) return t = new Ae(e), ++this._modelCount, t;
            throw new Error("Unknown error")
        }
        deleteModel(t) {
            null != t && --this._modelCount
        }
        constructor(t) {
            this._moc = t, this._modelCount = 0
        }
        release() {
            this._moc._release(), this._moc = void 0
        }
    }
    var Re = (t => (t[t.CubismPhysicsTargetType_Parameter = 0] = "CubismPhysicsTargetType_Parameter", t))(Re || {}),
        Oe = (t => (t[t.CubismPhysicsSource_X = 0] = "CubismPhysicsSource_X", t[t.CubismPhysicsSource_Y = 1] = "CubismPhysicsSource_Y", t[t.CubismPhysicsSource_Angle = 2] = "CubismPhysicsSource_Angle", t))(Oe || {});
    class ke {
        constructor() {
            this.initialPosition = new ut(0, 0), this.position = new ut(0, 0), this.lastPosition = new ut(0, 0), this.lastGravity = new ut(0, 0), this.force = new ut(0, 0), this.velocity = new ut(0, 0)
        }
    }
    class Ue {
        constructor() {
            this.normalizationPosition = {}, this.normalizationAngle = {}
        }
    }
    class Ne {
        constructor() {
            this.source = {}
        }
    }
    class Ve {
        constructor() {
            this.destination = {}, this.translationScale = new ut(0, 0)
        }
    }
    class Ge {
        constructor() {
            this.settings = [], this.inputs = [], this.outputs = [], this.particles = [], this.gravity = new ut(0, 0), this.wind = new ut(0, 0)
        }
    }
    class je {
        constructor(t) {
            this._json = t
        }
        release() {
            this._json = void 0
        }
        getGravity() {
            const t = new ut(0, 0);
            return t.x = this._json.Meta.EffectiveForces.Gravity.X, t.y = this._json.Meta.EffectiveForces.Gravity.Y, t
        }
        getWind() {
            const t = new ut(0, 0);
            return t.x = this._json.Meta.EffectiveForces.Wind.X, t.y = this._json.Meta.EffectiveForces.Wind.Y, t
        }
        getSubRigCount() {
            return this._json.Meta.PhysicsSettingCount
        }
        getTotalInputCount() {
            return this._json.Meta.TotalInputCount
        }
        getTotalOutputCount() {
            return this._json.Meta.TotalOutputCount
        }
        getVertexCount() {
            return this._json.Meta.VertexCount
        }
        getNormalizationPositionMinimumValue(t) {
            return this._json.PhysicsSettings[t].Normalization.Position.Minimum
        }
        getNormalizationPositionMaximumValue(t) {
            return this._json.PhysicsSettings[t].Normalization.Position.Maximum
        }
        getNormalizationPositionDefaultValue(t) {
            return this._json.PhysicsSettings[t].Normalization.Position.Default
        }
        getNormalizationAngleMinimumValue(t) {
            return this._json.PhysicsSettings[t].Normalization.Angle.Minimum
        }
        getNormalizationAngleMaximumValue(t) {
            return this._json.PhysicsSettings[t].Normalization.Angle.Maximum
        }
        getNormalizationAngleDefaultValue(t) {
            return this._json.PhysicsSettings[t].Normalization.Angle.Default
        }
        getInputCount(t) {
            return this._json.PhysicsSettings[t].Input.length
        }
        getInputWeight(t, e) {
            return this._json.PhysicsSettings[t].Input[e].Weight
        }
        getInputReflect(t, e) {
            return this._json.PhysicsSettings[t].Input[e].Reflect
        }
        getInputType(t, e) {
            return this._json.PhysicsSettings[t].Input[e].Type
        }
        getInputSourceId(t, e) {
            return this._json.PhysicsSettings[t].Input[e].Source.Id
        }
        getOutputCount(t) {
            return this._json.PhysicsSettings[t].Output.length
        }
        getOutputVertexIndex(t, e) {
            return this._json.PhysicsSettings[t].Output[e].VertexIndex
        }
        getOutputAngleScale(t, e) {
            return this._json.PhysicsSettings[t].Output[e].Scale
        }
        getOutputWeight(t, e) {
            return this._json.PhysicsSettings[t].Output[e].Weight
        }
        getOutputDestinationId(t, e) {
            return this._json.PhysicsSettings[t].Output[e].Destination.Id
        }
        getOutputType(t, e) {
            return this._json.PhysicsSettings[t].Output[e].Type
        }
        getOutputReflect(t, e) {
            return this._json.PhysicsSettings[t].Output[e].Reflect
        }
        getParticleCount(t) {
            return this._json.PhysicsSettings[t].Vertices.length
        }
        getParticleMobility(t, e) {
            return this._json.PhysicsSettings[t].Vertices[e].Mobility
        }
        getParticleDelay(t, e) {
            return this._json.PhysicsSettings[t].Vertices[e].Delay
        }
        getParticleAcceleration(t, e) {
            return this._json.PhysicsSettings[t].Vertices[e].Acceleration
        }
        getParticleRadius(t, e) {
            return this._json.PhysicsSettings[t].Vertices[e].Radius
        }
        getParticlePosition(t, e) {
            const i = new ut(0, 0);
            return i.x = this._json.PhysicsSettings[t].Vertices[e].Position.X, i.y = this._json.PhysicsSettings[t].Vertices[e].Position.Y, i
        }
    }
    const Xe = "Angle";
    class ze {
        static create(t) {
            const e = new ze;
            return e.parse(t), e._physicsRig.gravity.y = 0, e
        }
        evaluate(t, e) {
            let i, s, r, a;
            const o = new ut;
            let n, l, h, d, u, c, g, m;
            u = t.getModel().parameters.values, c = t.getModel().parameters.maximumValues, g = t.getModel().parameters.minimumValues, m = t.getModel().parameters.defaultValues;
            for (let p = 0; p < this._physicsRig.subRigCount; ++p) {
                i = {
                    angle: 0
                }, o.x = 0, o.y = 0, n = this._physicsRig.settings[p], l = this._physicsRig.inputs.slice(n.baseInputIndex), h = this._physicsRig.outputs.slice(n.baseOutputIndex), d = this._physicsRig.particles.slice(n.baseParticleIndex);
                for (let e = 0; e < n.inputCount; ++e) s = l[e].weight / 100, -1 == l[e].sourceParameterIndex && (l[e].sourceParameterIndex = t.getParameterIndex(l[e].source.id)), l[e].getNormalizedParameterValue(o, i, u[l[e].sourceParameterIndex], g[l[e].sourceParameterIndex], c[l[e].sourceParameterIndex], m[l[e].sourceParameterIndex], n.normalizationPosition, n.normalizationAngle, l[e].reflect, s);
                r = gt.degreesToRadian(-i.angle), o.x = o.x * gt.cos(r) - o.y * gt.sin(r), o.y = o.x * gt.sin(r) + o.y * gt.cos(r), ii(d, n.particleCount, o, i.angle, this._options.wind, .001 * n.normalizationPosition.maximum, e, 5);
                for (let e = 0; e < n.outputCount; ++e) {
                    const i = h[e].vertexIndex;
                    if (i < 1 || i >= n.particleCount) break; - 1 == h[e].destinationParameterIndex && (h[e].destinationParameterIndex = t.getParameterIndex(h[e].destination.id));
                    const s = new ut;
                    s.x = d[i].position.x - d[i - 1].position.x, s.y = d[i].position.y - d[i - 1].position.y, a = h[e].getValue(s, d, i, h[e].reflect, this._options.gravity);
                    const r = h[e].destinationParameterIndex,
                        o = !Float32Array.prototype.slice && "subarray" in Float32Array.prototype ? JSON.parse(JSON.stringify(u.subarray(r))) : u.slice(r);
                    si(o, g[r], c[r], a, h[e]);
                    for (let t = r, e = 0; t < u.length; t++, e++) u[t] = o[e]
                }
            }
        }
        setOptions(t) {
            this._options = t
        }
        getOption() {
            return this._options
        }
        constructor() {
            this._options = new We, this._options.gravity.y = -1, this._options.gravity.x = 0, this._options.wind.x = 0, this._options.wind.y = 0
        }
        release() {
            this._physicsRig = void 0
        }
        parse(t) {
            this._physicsRig = new Ge;
            let e = new je(t);
            this._physicsRig.gravity = e.getGravity(), this._physicsRig.wind = e.getWind(), this._physicsRig.subRigCount = e.getSubRigCount();
            let i = 0,
                s = 0,
                r = 0;
            for (let a = 0; a < this._physicsRig.subRigCount; ++a) {
                const t = new Ue;
                t.normalizationPosition.minimum = e.getNormalizationPositionMinimumValue(a), t.normalizationPosition.maximum = e.getNormalizationPositionMaximumValue(a), t.normalizationPosition.defalut = e.getNormalizationPositionDefaultValue(a), t.normalizationAngle.minimum = e.getNormalizationAngleMinimumValue(a), t.normalizationAngle.maximum = e.getNormalizationAngleMaximumValue(a), t.normalizationAngle.defalut = e.getNormalizationAngleDefaultValue(a), t.inputCount = e.getInputCount(a), t.baseInputIndex = i, i += t.inputCount;
                for (let i = 0; i < t.inputCount; ++i) {
                    const t = new Ne;
                    switch (t.sourceParameterIndex = -1, t.weight = e.getInputWeight(a, i), t.reflect = e.getInputReflect(a, i), e.getInputType(a, i)) {
                        case "X":
                            t.type = Oe.CubismPhysicsSource_X, t.getNormalizedParameterValue = Ye;
                            break;
                        case "Y":
                            t.type = Oe.CubismPhysicsSource_Y, t.getNormalizedParameterValue = He;
                            break;
                        case Xe:
                            t.type = Oe.CubismPhysicsSource_Angle, t.getNormalizedParameterValue = qe
                    }
                    t.source.targetType = Re.CubismPhysicsTargetType_Parameter, t.source.id = e.getInputSourceId(a, i), this._physicsRig.inputs.push(t)
                }
                t.outputCount = e.getOutputCount(a), t.baseOutputIndex = s, s += t.outputCount;
                for (let i = 0; i < t.outputCount; ++i) {
                    const t = new Ve;
                    switch (t.destinationParameterIndex = -1, t.vertexIndex = e.getOutputVertexIndex(a, i), t.angleScale = e.getOutputAngleScale(a, i), t.weight = e.getOutputWeight(a, i), t.destination.targetType = Re.CubismPhysicsTargetType_Parameter, t.destination.id = e.getOutputDestinationId(a, i), e.getOutputType(a, i)) {
                        case "X":
                            t.type = Oe.CubismPhysicsSource_X, t.getValue = $e, t.getScale = Ke;
                            break;
                        case "Y":
                            t.type = Oe.CubismPhysicsSource_Y, t.getValue = Ze, t.getScale = ti;
                            break;
                        case Xe:
                            t.type = Oe.CubismPhysicsSource_Angle, t.getValue = Je, t.getScale = ei
                    }
                    t.reflect = e.getOutputReflect(a, i), this._physicsRig.outputs.push(t)
                }
                t.particleCount = e.getParticleCount(a), t.baseParticleIndex = r, r += t.particleCount;
                for (let i = 0; i < t.particleCount; ++i) {
                    const t = new ke;
                    t.mobility = e.getParticleMobility(a, i), t.delay = e.getParticleDelay(a, i), t.acceleration = e.getParticleAcceleration(a, i), t.radius = e.getParticleRadius(a, i), t.position = e.getParticlePosition(a, i), this._physicsRig.particles.push(t)
                }
                this._physicsRig.settings.push(t)
            }
            this.initialize(), e.release()
        }
        initialize() {
            let t, e, i;
            for (let s = 0; s < this._physicsRig.subRigCount; ++s) {
                e = this._physicsRig.settings[s], t = this._physicsRig.particles.slice(e.baseParticleIndex), t[0].initialPosition = new ut(0, 0), t[0].lastPosition = new ut(t[0].initialPosition.x, t[0].initialPosition.y), t[0].lastGravity = new ut(0, -1), t[0].lastGravity.y *= -1, t[0].velocity = new ut(0, 0), t[0].force = new ut(0, 0);
                for (let s = 1; s < e.particleCount; ++s) i = new ut(0, 0), i.y = t[s].radius, t[s].initialPosition = new ut(t[s - 1].initialPosition.x + i.x, t[s - 1].initialPosition.y + i.y), t[s].position = new ut(t[s].initialPosition.x, t[s].initialPosition.y), t[s].lastPosition = new ut(t[s].initialPosition.x, t[s].initialPosition.y), t[s].lastGravity = new ut(0, -1), t[s].lastGravity.y *= -1, t[s].velocity = new ut(0, 0), t[s].force = new ut(0, 0)
            }
        }
    }
    class We {
        constructor() {
            this.gravity = new ut(0, 0), this.wind = new ut(0, 0)
        }
    }

    function Ye(t, e, i, s, r, a, o, n, l, h) {
        t.x += ri(i, s, r, a, o.minimum, o.maximum, o.defalut, l) * h
    }

    function He(t, e, i, s, r, a, o, n, l, h) {
        t.y += ri(i, s, r, a, o.minimum, o.maximum, o.defalut, l) * h
    }

    function qe(t, e, i, s, r, a, o, n, l, h) {
        e.angle += ri(i, s, r, a, n.minimum, n.maximum, n.defalut, l) * h
    }

    function $e(t, e, i, s, r) {
        let a = t.x;
        return s && (a *= -1), a
    }

    function Ze(t, e, i, s, r) {
        let a = t.y;
        return s && (a *= -1), a
    }

    function Je(t, e, i, s, r) {
        let a;
        return r = i >= 2 ? e[i - 1].position.substract(e[i - 2].position) : r.multiplyByScaler(-1), a = gt.directionToRadian(r, t), s && (a *= -1), a
    }

    function Qe(t, e) {
        return Math.min(t, e) + function(t, e) {
            return Math.abs(Math.max(t, e) - Math.min(t, e))
        }(t, e) / 2
    }

    function Ke(t, e) {
        return t.x
    }

    function ti(t, e) {
        return t.y
    }

    function ei(t, e) {
        return e
    }

    function ii(t, e, i, s, r, a, o, n) {
        let l, h, d, u, c = new ut(0, 0),
            g = new ut(0, 0),
            m = new ut(0, 0),
            p = new ut(0, 0);
        t[0].position = new ut(i.x, i.y), l = gt.degreesToRadian(s), u = gt.radianToDirection(l), u.normalize();
        for (let _ = 1; _ < e; ++_) t[_].force = u.multiplyByScaler(t[_].acceleration).add(r), t[_].lastPosition = new ut(t[_].position.x, t[_].position.y), h = t[_].delay * o * 30, c = t[_].position.substract(t[_ - 1].position), d = gt.directionToRadian(t[_].lastGravity, u) / n, c.x = gt.cos(d) * c.x - c.y * gt.sin(d), c.y = gt.sin(d) * c.x + c.y * gt.cos(d), t[_].position = t[_ - 1].position.add(c), g = t[_].velocity.multiplyByScaler(h), m = t[_].force.multiplyByScaler(h).multiplyByScaler(h), t[_].position = t[_].position.add(g).add(m), p = t[_].position.substract(t[_ - 1].position), p.normalize(), t[_].position = t[_ - 1].position.add(p.multiplyByScaler(t[_].radius)), gt.abs(t[_].position.x) < a && (t[_].position.x = 0), 0 != h && (t[_].velocity = t[_].position.substract(t[_].lastPosition), t[_].velocity = t[_].velocity.divisionByScalar(h), t[_].velocity = t[_].velocity.multiplyByScaler(t[_].mobility)), t[_].force = new ut(0, 0), t[_].lastGravity = new ut(u.x, u.y)
    }

    function si(t, e, i, s, r) {
        let a, o, n;
        a = r.getScale(r.translationScale, r.angleScale), o = s * a, o < e ? (o < r.valueBelowMinimum && (r.valueBelowMinimum = o), o = e) : o > i && (o > r.valueExceededMaximum && (r.valueExceededMaximum = o), o = i), n = r.weight / 100, n >= 1 || (o = t[0] * (1 - n) + o * n), t[0] = o
    }

    function ri(t, e, i, s, r, a, o, n) {
        let l = 0;
        const h = gt.max(i, e);
        h < t && (t = h);
        const d = gt.min(i, e);
        d > t && (t = d);
        const u = gt.min(r, a),
            c = gt.max(r, a),
            g = o,
            m = Qe(d, h),
            p = t - m;
        switch (Math.sign(p)) {
            case 1: {
                const t = c - g,
                    e = h - m;
                0 != e && (l = p * (t / e), l += g);
                break
            }
            case -1: {
                const t = u - g,
                    e = d - m;
                0 != e && (l = p * (t / e), l += g);
                break
            }
            case 0:
                l = g
        }
        return n ? l : -1 * l
    }

    function ai() {
        var t;
        null == (t = this.__moc) || t.release()
    }
    N.registerRuntime({
        version: 4,
        ready: Le,
        test: t => t instanceof Ut || Ut.isValidJSON(t),
        isValidMoc(t) {
            if (t.byteLength < 4) return !1;
            const e = new Int8Array(t, 0, 4);
            return "MOC3" === String.fromCharCode(...e)
        },
        createModelSettings: t => new Ut(t),
        createCoreModel(t) {
            const e = Be.create(t);
            try {
                const t = e.createModel();
                return t.__moc = e, t
            } catch (i) {
                try {
                    e.release()
                } catch (s) {}
                throw i
            }
        },
        createInternalModel(t, e, i) {
            const s = new Ie(t, e, i),
                r = t;
            return r.__moc && (s.__moc = r.__moc, delete r.__moc, s.once("destroy", ai)), s
        },
        createPhysics: (t, e) => ze.create(e),
        createPose: (t, e) => Fe.create(e)
    }), t.Cubism2ExpressionManager = tt, t.Cubism2InternalModel = rt, t.Cubism2ModelSettings = at, t.Cubism2MotionManager = et, t.Cubism4ExpressionManager = Ot, t.Cubism4InternalModel = Ie, t.Cubism4ModelSettings = Ut, t.Cubism4MotionManager = ie, t.ExpressionManager = _, t.FileLoader = $, t.FocusController = f, t.InteractionMixin = V, t.InternalModel = b, t.LOGICAL_HEIGHT = 2, t.LOGICAL_WIDTH = 2, t.Live2DExpression = K, t.Live2DEyeBlink = it, t.Live2DFactory = N, t.Live2DLoader = E, t.Live2DModel = H, t.Live2DPhysics = lt, t.Live2DPose = dt, t.Live2DTransform = X, t.ModelSettings = x, t.MotionManager = C, t.MotionPreloadStrategy = P, t.MotionPriority = y, t.MotionState = M, t.SoundManager = v, t.VERSION = "0.4.0", t.XHRLoader = T, t.ZipLoader = J, t.applyMixins = g, t.clamp = h, t.copyArray = c, t.copyProperty = u, t.cubism4Ready = Le, t.folderName = m, t.logger = l, t.rand = d, t.remove = p, t.startUpCubism4 = Ee, Object.defineProperties(t, {
        __esModule: {
            value: !0
        },
        [Symbol.toStringTag]: {
            value: "Module"
        }
    })
}));