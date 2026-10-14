import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("astro/runtime/client/dev-toolbar/entrypoint.js");import { loadDevToolbarApps } from "/@id/__x00__astro:toolbar:internal";
//#region node_modules/astro/dist/runtime/client/dev-toolbar/helpers.js
var ToolbarAppEventTarget = class extends EventTarget {
	constructor() {
		super();
	}
	/**
	* Toggle the notification state of the toolbar
	* @param options - The notification options
	* @param options.state - The state of the notification
	* @param options.level - The level of the notification, optional when state is false
	*/
	toggleNotification(options) {
		this.dispatchEvent(new CustomEvent("toggle-notification", { detail: {
			state: options.state,
			level: options.state === true ? options.level : void 0
		} }));
	}
	/**
	* Toggle the app state on or off
	* @param options - The app state options
	* @param options.state - The new state of the app
	*/
	toggleState(options) {
		this.dispatchEvent(new CustomEvent("toggle-app", { detail: { state: options.state } }));
	}
	/**
	* Fired when the app is toggled on or off
	* @param callback - The callback to run when the event is fired, takes an object with the new state
	*/
	onToggled(callback) {
		this.addEventListener("app-toggled", (evt) => {
			if (!(evt instanceof CustomEvent)) return;
			callback(evt.detail);
		});
	}
	/**
	* Fired when the toolbar placement is updated by the user
	* @param callback - The callback to run when the event is fired, takes an object with the new placement
	*/
	onToolbarPlacementUpdated(callback) {
		this.addEventListener("placement-updated", (evt) => {
			if (!(evt instanceof CustomEvent)) return;
			callback(evt.detail);
		});
	}
};
var serverHelpers = {
	/**
	* Send a message to the server, the payload can be any serializable data.
	*
	* The server can listen for this message in the `astro:server:config` hook of an Astro integration, using the `toolbar.on` method.
	*
	* @param event - The event name
	* @param payload - The payload to send
	*/
	send: (event, payload) => {
		if (import.meta.hot) import.meta.hot.send(event, payload);
	},
	/**
	* Receive a message from the server.
	* @param event - The event name
	* @param callback - The callback to run when the event is received.
	* The payload's content will be passed to the callback as an argument
	*/
	on: (event, callback) => {
		if (import.meta.hot) import.meta.hot.on(event, callback);
	}
};
//#endregion
//#region node_modules/astro/dist/runtime/client/dev-toolbar/ui-library/window.js
var placements = [
	"bottom-left",
	"bottom-center",
	"bottom-right"
];
function isValidPlacement(value) {
	return placements.map(String).includes(value);
}
var DevToolbarWindow = class extends HTMLElement {
	shadowRoot;
	_placement = defaultSettings.placement;
	get placement() {
		return this._placement;
	}
	set placement(value) {
		if (!isValidPlacement(value)) {
			settings.logger.error(`Invalid placement: ${value}, expected one of ${placements.join(", ")}, got ${value}.`);
			return;
		}
		this._placement = value;
		this.updateStyle();
	}
	static observedAttributes = ["placement"];
	constructor() {
		super();
		this.shadowRoot = this.attachShadow({ mode: "open" });
	}
	async connectedCallback() {
		this.shadowRoot.innerHTML = `
			<style>
				:host {
					box-sizing: border-box;
					display: flex;
					flex-direction: column;
					background: linear-gradient(0deg, #13151A, #13151A), linear-gradient(0deg, #343841, #343841);
					border: 1px solid rgba(52, 56, 65, 1);
					width: min(640px, 100%);
					max-height: 480px;
					border-radius: 12px;
					padding: 24px;
					font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
					color: rgba(191, 193, 201, 1);
					position: fixed;
					z-index: 999999999;
					bottom: 72px;
					box-shadow: 0px 0px 0px 0px rgba(19, 21, 26, 0.30), 0px 1px 2px 0px rgba(19, 21, 26, 0.29), 0px 4px 4px 0px rgba(19, 21, 26, 0.26), 0px 10px 6px 0px rgba(19, 21, 26, 0.15), 0px 17px 7px 0px rgba(19, 21, 26, 0.04), 0px 26px 7px 0px rgba(19, 21, 26, 0.01);
				}

				@media (forced-colors: active) {
					:host {
						background: white;
					}
				}

				@media (max-width: 640px) {
					:host {
						border-radius: 0;
					}
				}

				::slotted(h1), ::slotted(h2), ::slotted(h3), ::slotted(h4), ::slotted(h5) {
					font-weight: 600;
					color: #fff;
				}

				::slotted(h1) {
					font-size: 22px;
				}

				::slotted(h2) {
					font-size: 20px;
				}

				::slotted(h3) {
					font-size: 18px;
				}

				::slotted(h4) {
					font-size: 16px;
				}

				::slotted(h5) {
					font-size: 14px;
				}

				hr, ::slotted(hr) {
					border: 1px solid rgba(27, 30, 36, 1);
					margin: 1em 0;
				}

				p, ::slotted(p) {
					line-height: 1.5em;
				}
			</style>
			<style id="selected-style"></style>

			<slot />
		`;
		this.updateStyle();
	}
	attributeChangedCallback() {
		if (this.hasAttribute("placement")) this.placement = this.getAttribute("placement");
	}
	updateStyle() {
		const style = this.shadowRoot.querySelector("#selected-style");
		if (style) style.innerHTML = {
			"bottom-left": `
					:host {
						left: 16px;
					}
				`,
			"bottom-center": `
					:host {
						left: 50%;
						transform: translateX(-50%);
					}
				`,
			"bottom-right": `
					:host {
						right: 16px;
					}
				`
		}[this.placement];
	}
};
//#endregion
//#region node_modules/astro/dist/runtime/client/dev-toolbar/settings.js
var defaultSettings = {
	disableAppNotification: false,
	verbose: false,
	placement: "bottom-center"
};
var settings = getSettings();
function getSettings() {
	let _settings = { ...defaultSettings };
	const configPlacement = globalThis.__astro_dev_toolbar__?.placement;
	if (configPlacement && isValidPlacement(configPlacement)) _settings.placement = configPlacement;
	const toolbarSettings = localStorage.getItem("astro:dev-toolbar:settings");
	if (toolbarSettings) _settings = {
		..._settings,
		...JSON.parse(toolbarSettings)
	};
	function updateSetting(key, value) {
		_settings[key] = value;
		localStorage.setItem("astro:dev-toolbar:settings", JSON.stringify(_settings));
	}
	function log(message, level = "log") {
		console[level](`%cAstro`, "background: linear-gradient(66.77deg, #D83333 0%, #F041FF 100%); color: white; padding-inline: 4px; border-radius: 2px; font-family: monospace;", message);
	}
	return {
		get config() {
			return _settings;
		},
		updateSetting,
		logger: {
			log,
			warn: (message) => {
				log(message, "warn");
			},
			error: (message) => {
				log(message, "error");
			},
			verboseLog: (message) => {
				if (_settings.verbose) log(message);
			}
		}
	};
}
//#endregion
//#region node_modules/astro/dist/runtime/client/dev-toolbar/entrypoint.js
var overlay;
document.addEventListener("DOMContentLoaded", async () => {
	const [customAppsDefinitions, { default: astroDevToolApp }, { default: astroAuditApp }, { default: astroXrayApp }, { default: astroSettingsApp }, { AstroDevToolbar, DevToolbarCanvas, getAppIcon }, { DevToolbarCard, DevToolbarHighlight, DevToolbarTooltip, DevToolbarWindow, DevToolbarToggle, DevToolbarButton, DevToolbarBadge, DevToolbarIcon, DevToolbarSelect, DevToolbarRadioCheckbox }] = await Promise.all([
		loadDevToolbarApps(),
		import("/node_modules/.vite/deps/astro-C3dVLYN0.js?v=7b6215b2"),
		import("/node_modules/.vite/deps/audit-Dsr9kP9J.js?v=7b6215b2"),
		import("/node_modules/.vite/deps/xray-DUe71W5L.js?v=7b6215b2"),
		import("/node_modules/.vite/deps/settings-CI954KWk.js?v=7b6215b2"),
		import("/node_modules/.vite/deps/toolbar-ClXjGTQI.js?v=7b6215b2"),
		import("/node_modules/.vite/deps/ui-library-D4E3Lh63.js?v=7b6215b2")
	]);
	customElements.define("astro-dev-toolbar", AstroDevToolbar);
	customElements.define("astro-dev-toolbar-window", DevToolbarWindow);
	customElements.define("astro-dev-toolbar-app-canvas", DevToolbarCanvas);
	customElements.define("astro-dev-toolbar-tooltip", DevToolbarTooltip);
	customElements.define("astro-dev-toolbar-highlight", DevToolbarHighlight);
	customElements.define("astro-dev-toolbar-card", DevToolbarCard);
	customElements.define("astro-dev-toolbar-toggle", DevToolbarToggle);
	customElements.define("astro-dev-toolbar-button", DevToolbarButton);
	customElements.define("astro-dev-toolbar-badge", DevToolbarBadge);
	customElements.define("astro-dev-toolbar-icon", DevToolbarIcon);
	customElements.define("astro-dev-toolbar-select", DevToolbarSelect);
	customElements.define("astro-dev-toolbar-radio-checkbox", DevToolbarRadioCheckbox);
	overlay = document.createElement("astro-dev-toolbar");
	const notificationLevels = [
		"error",
		"warning",
		"info"
	];
	const notificationSVGs = {
		error: "<svg viewBox=\"0 0 10 10\" style=\"--fill:var(--fill-default);--fill-default:#B33E66;--fill-hover:#E3AFC1;\"><rect width=\"9\" height=\"9\" x=\".5\" y=\".5\" fill=\"var(--fill)\" stroke=\"#13151A\" stroke-width=\"2\" rx=\"4.5\"/></svg>",
		warning: "<svg width=\"12\" height=\"10\" fill=\"none\" style=\"--fill:var(--fill-default);--fill-default:#B58A2D;--fill-hover:#D5B776;\"><path fill=\"var(--fill)\" stroke=\"#13151A\" stroke-width=\"2\" d=\"M7.29904 1.25c-.57735-1-2.02073-1-2.59808 0l-3.4641 6C.65951 8.25 1.3812 9.5 2.5359 9.5h6.9282c1.1547 0 1.8764-1.25 1.299-2.25l-3.46406-6Z\"/></svg>",
		info: "<svg viewBox=\"0 0 10 10\" style=\"--fill:var(--fill-default);--fill-default:#3645D9;--fill-hover:#BDC3FF;\"><rect width=\"9\" height=\"9\" x=\".5\" y=\".5\" fill=\"var(--fill)\" stroke=\"#13151A\" stroke-width=\"2\" rx=\"1.5\"/></svg>"
	};
	const prepareApp = (appDefinition, builtIn) => {
		const eventTarget = new ToolbarAppEventTarget();
		const app = {
			...appDefinition,
			builtIn,
			active: false,
			status: "loading",
			notification: {
				state: false,
				level: void 0
			},
			eventTarget
		};
		eventTarget.addEventListener("toggle-notification", (evt) => {
			if (!(evt instanceof CustomEvent)) return;
			const target = overlay.shadowRoot?.querySelector(`[data-app-id="${app.id}"]`);
			if (!target) return;
			const notificationElement = target.querySelector(".notification");
			if (!notificationElement) return;
			let newState = evt.detail.state ?? true;
			let level = notificationLevels.includes(evt?.detail?.level) ? evt.detail.level : "error";
			app.notification.state = newState;
			if (newState) app.notification.level = level;
			notificationElement.toggleAttribute("data-active", newState);
			if (newState) {
				notificationElement.setAttribute("data-level", level);
				notificationElement.innerHTML = notificationSVGs[level];
			}
		});
		const onToggleApp = async (evt) => {
			let newState = void 0;
			if (evt instanceof CustomEvent) newState = evt.detail.state ?? true;
			await overlay.setAppStatus(app, newState);
		};
		eventTarget.addEventListener("toggle-app", onToggleApp);
		return app;
	};
	const apps = [...[
		astroDevToolApp,
		astroXrayApp,
		astroAuditApp,
		astroSettingsApp,
		{
			id: "astro:more",
			name: "More",
			icon: "dots-three",
			init(canvas, eventTarget) {
				const hiddenApps = apps.filter((p) => !p.builtIn).slice(overlay.customAppsToShow);
				createDropdown();
				document.addEventListener("astro:after-swap", createDropdown);
				function createDropdown() {
					const style = document.createElement("style");
					style.innerHTML = `
					#dropdown {
						background: rgba(19, 21, 26, 1);
						border: 1px solid rgba(52, 56, 65, 1);
						border-radius: 12px;
						box-shadow: 0px 0px 0px 0px rgba(19, 21, 26, 0.30), 0px 1px 2px 0px rgba(19, 21, 26, 0.29), 0px 4px 4px 0px rgba(19, 21, 26, 0.26), 0px 10px 6px 0px rgba(19, 21, 26, 0.15), 0px 17px 7px 0px rgba(19, 21, 26, 0.04), 0px 26px 7px 0px rgba(19, 21, 26, 0.01);
						width: 192px;
						padding: 8px;
						z-index: 2000000010;
						transform: translate(-50%, 0%);
						position: fixed;
						bottom: 72px;
						left: 50%;
					}

					.notification {
						display: none;
						position: absolute;
						top: -4px;
						right: -5px;
						width: 12px;
						height: 10px;
					}

					.notification svg {
						display: block;
					}

					#dropdown:not([data-no-notification]) .notification[data-active] {
						display: block;
					}

					#dropdown button {
						border: 0;
						background: transparent;
						color: white;
						font-family: system-ui, sans-serif;
						font-size: 14px;
						white-space: nowrap;
						text-decoration: none;
						margin: 0;
						display: flex;
						align-items: center;
						width: 100%;
						padding: 8px;
						border-radius: 8px;
					}

					#dropdown button:hover, #dropdown button:focus-visible {
						background: #FFFFFF20;
						cursor: pointer;
					}

					#dropdown button.active {
						background: rgba(71, 78, 94, 1);
					}

					#dropdown .icon {
						position: relative;
						height: 20px;
						width: 20px;
						padding: 1px;
						margin-right: 0.5em;
					}

					#dropdown .icon svg {
						max-height: 100%;
						max-width: 100%;
					}
				`;
					canvas.append(style);
					const dropdown = document.createElement("div");
					dropdown.id = "dropdown";
					dropdown.toggleAttribute("data-no-notification", settings.config.disableAppNotification);
					for (const app of hiddenApps) {
						const buttonContainer = document.createElement("div");
						buttonContainer.classList.add("item");
						const button = document.createElement("button");
						button.setAttribute("data-app-id", app.id);
						const iconContainer = document.createElement("div");
						const iconElement = document.createElement("template");
						iconElement.innerHTML = app.icon ? getAppIcon(app.icon) : "?";
						iconContainer.append(iconElement.content.cloneNode(true));
						const notification = document.createElement("div");
						notification.classList.add("notification");
						iconContainer.append(notification);
						iconContainer.classList.add("icon");
						button.append(iconContainer);
						button.append(document.createTextNode(app.name));
						button.addEventListener("click", () => {
							overlay.toggleAppStatus(app);
						});
						buttonContainer.append(button);
						dropdown.append(buttonContainer);
						app.eventTarget.addEventListener("toggle-notification", (evt) => {
							if (!(evt instanceof CustomEvent)) return;
							let newState = evt.detail.state ?? true;
							let level = notificationLevels.includes(evt?.detail?.level) ? evt.detail.level : "error";
							notification.toggleAttribute("data-active", newState);
							if (newState) {
								notification.setAttribute("data-level", level);
								notification.innerHTML = notificationSVGs[level];
							}
							app.notification.state = newState;
							if (newState) app.notification.level = level;
							eventTarget.dispatchEvent(new CustomEvent("toggle-notification", { detail: {
								state: hiddenApps.some((p) => p.notification.state === true),
								level: [
									"error",
									"warning",
									"info"
								].find((notificationLevel) => hiddenApps.some((p) => p.notification.state === true && p.notification.level === notificationLevel)) ?? "error"
							} }));
						});
					}
					canvas.append(dropdown);
				}
			}
		}
	].map((appDef) => prepareApp(appDef, true)), ...customAppsDefinitions.map((appDef) => prepareApp(appDef, false))];
	overlay.apps = apps;
	document.body.append(overlay);
	document.addEventListener("astro:after-swap", () => {
		document.body.append(overlay);
	});
});
//#endregion
export { serverHelpers as a, placements as i, DevToolbarWindow as n, isValidPlacement as r, settings as t };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN0cm9fcnVudGltZV9jbGllbnRfZGV2LXRvb2xiYXJfZW50cnlwb2ludF9fanMuanMiLCJuYW1lcyI6W10sInNvdXJjZXMiOlsiLi4vLi4vYXN0cm8vZGlzdC9ydW50aW1lL2NsaWVudC9kZXYtdG9vbGJhci9oZWxwZXJzLmpzIiwiLi4vLi4vYXN0cm8vZGlzdC9ydW50aW1lL2NsaWVudC9kZXYtdG9vbGJhci91aS1saWJyYXJ5L3dpbmRvdy5qcyIsIi4uLy4uL2FzdHJvL2Rpc3QvcnVudGltZS9jbGllbnQvZGV2LXRvb2xiYXIvc2V0dGluZ3MuanMiLCIuLi8uLi9hc3Ryby9kaXN0L3J1bnRpbWUvY2xpZW50L2Rldi10b29sYmFyL2VudHJ5cG9pbnQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIFRvb2xiYXJBcHBFdmVudFRhcmdldCBleHRlbmRzIEV2ZW50VGFyZ2V0IHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKTtcblx0fVxuXHQvKipcblx0KiBUb2dnbGUgdGhlIG5vdGlmaWNhdGlvbiBzdGF0ZSBvZiB0aGUgdG9vbGJhclxuXHQqIEBwYXJhbSBvcHRpb25zIC0gVGhlIG5vdGlmaWNhdGlvbiBvcHRpb25zXG5cdCogQHBhcmFtIG9wdGlvbnMuc3RhdGUgLSBUaGUgc3RhdGUgb2YgdGhlIG5vdGlmaWNhdGlvblxuXHQqIEBwYXJhbSBvcHRpb25zLmxldmVsIC0gVGhlIGxldmVsIG9mIHRoZSBub3RpZmljYXRpb24sIG9wdGlvbmFsIHdoZW4gc3RhdGUgaXMgZmFsc2Vcblx0Ki9cblx0dG9nZ2xlTm90aWZpY2F0aW9uKG9wdGlvbnMpIHtcblx0XHR0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KFwidG9nZ2xlLW5vdGlmaWNhdGlvblwiLCB7IGRldGFpbDoge1xuXHRcdFx0c3RhdGU6IG9wdGlvbnMuc3RhdGUsXG5cdFx0XHRsZXZlbDogb3B0aW9ucy5zdGF0ZSA9PT0gdHJ1ZSA/IG9wdGlvbnMubGV2ZWwgOiB1bmRlZmluZWRcblx0XHR9IH0pKTtcblx0fVxuXHQvKipcblx0KiBUb2dnbGUgdGhlIGFwcCBzdGF0ZSBvbiBvciBvZmZcblx0KiBAcGFyYW0gb3B0aW9ucyAtIFRoZSBhcHAgc3RhdGUgb3B0aW9uc1xuXHQqIEBwYXJhbSBvcHRpb25zLnN0YXRlIC0gVGhlIG5ldyBzdGF0ZSBvZiB0aGUgYXBwXG5cdCovXG5cdHRvZ2dsZVN0YXRlKG9wdGlvbnMpIHtcblx0XHR0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KFwidG9nZ2xlLWFwcFwiLCB7IGRldGFpbDogeyBzdGF0ZTogb3B0aW9ucy5zdGF0ZSB9IH0pKTtcblx0fVxuXHQvKipcblx0KiBGaXJlZCB3aGVuIHRoZSBhcHAgaXMgdG9nZ2xlZCBvbiBvciBvZmZcblx0KiBAcGFyYW0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdG8gcnVuIHdoZW4gdGhlIGV2ZW50IGlzIGZpcmVkLCB0YWtlcyBhbiBvYmplY3Qgd2l0aCB0aGUgbmV3IHN0YXRlXG5cdCovXG5cdG9uVG9nZ2xlZChjYWxsYmFjaykge1xuXHRcdHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihcImFwcC10b2dnbGVkXCIsIChldnQpID0+IHtcblx0XHRcdGlmICghKGV2dCBpbnN0YW5jZW9mIEN1c3RvbUV2ZW50KSkgcmV0dXJuO1xuXHRcdFx0Y2FsbGJhY2soZXZ0LmRldGFpbCk7XG5cdFx0fSk7XG5cdH1cblx0LyoqXG5cdCogRmlyZWQgd2hlbiB0aGUgdG9vbGJhciBwbGFjZW1lbnQgaXMgdXBkYXRlZCBieSB0aGUgdXNlclxuXHQqIEBwYXJhbSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0byBydW4gd2hlbiB0aGUgZXZlbnQgaXMgZmlyZWQsIHRha2VzIGFuIG9iamVjdCB3aXRoIHRoZSBuZXcgcGxhY2VtZW50XG5cdCovXG5cdG9uVG9vbGJhclBsYWNlbWVudFVwZGF0ZWQoY2FsbGJhY2spIHtcblx0XHR0aGlzLmFkZEV2ZW50TGlzdGVuZXIoXCJwbGFjZW1lbnQtdXBkYXRlZFwiLCAoZXZ0KSA9PiB7XG5cdFx0XHRpZiAoIShldnQgaW5zdGFuY2VvZiBDdXN0b21FdmVudCkpIHJldHVybjtcblx0XHRcdGNhbGxiYWNrKGV2dC5kZXRhaWwpO1xuXHRcdH0pO1xuXHR9XG59XG5leHBvcnQgY29uc3Qgc2VydmVySGVscGVycyA9IHtcblx0LyoqXG5cdCogU2VuZCBhIG1lc3NhZ2UgdG8gdGhlIHNlcnZlciwgdGhlIHBheWxvYWQgY2FuIGJlIGFueSBzZXJpYWxpemFibGUgZGF0YS5cblx0KlxuXHQqIFRoZSBzZXJ2ZXIgY2FuIGxpc3RlbiBmb3IgdGhpcyBtZXNzYWdlIGluIHRoZSBgYXN0cm86c2VydmVyOmNvbmZpZ2AgaG9vayBvZiBhbiBBc3RybyBpbnRlZ3JhdGlvbiwgdXNpbmcgdGhlIGB0b29sYmFyLm9uYCBtZXRob2QuXG5cdCpcblx0KiBAcGFyYW0gZXZlbnQgLSBUaGUgZXZlbnQgbmFtZVxuXHQqIEBwYXJhbSBwYXlsb2FkIC0gVGhlIHBheWxvYWQgdG8gc2VuZFxuXHQqL1xuXHRzZW5kOiAoZXZlbnQsIHBheWxvYWQpID0+IHtcblx0XHRpZiAoaW1wb3J0Lm1ldGEuaG90KSB7XG5cdFx0XHRpbXBvcnQubWV0YS5ob3Quc2VuZChldmVudCwgcGF5bG9hZCk7XG5cdFx0fVxuXHR9LFxuXHQvKipcblx0KiBSZWNlaXZlIGEgbWVzc2FnZSBmcm9tIHRoZSBzZXJ2ZXIuXG5cdCogQHBhcmFtIGV2ZW50IC0gVGhlIGV2ZW50IG5hbWVcblx0KiBAcGFyYW0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdG8gcnVuIHdoZW4gdGhlIGV2ZW50IGlzIHJlY2VpdmVkLlxuXHQqIFRoZSBwYXlsb2FkJ3MgY29udGVudCB3aWxsIGJlIHBhc3NlZCB0byB0aGUgY2FsbGJhY2sgYXMgYW4gYXJndW1lbnRcblx0Ki9cblx0b246IChldmVudCwgY2FsbGJhY2spID0+IHtcblx0XHRpZiAoaW1wb3J0Lm1ldGEuaG90KSB7XG5cdFx0XHRpbXBvcnQubWV0YS5ob3Qub24oZXZlbnQsIGNhbGxiYWNrKTtcblx0XHR9XG5cdH1cbn07XG4iLCJpbXBvcnQgeyBkZWZhdWx0U2V0dGluZ3MsIHNldHRpbmdzIH0gZnJvbSBcIi4uL3NldHRpbmdzLmpzXCI7XG5leHBvcnQgY29uc3QgcGxhY2VtZW50cyA9IFtcblx0XCJib3R0b20tbGVmdFwiLFxuXHRcImJvdHRvbS1jZW50ZXJcIixcblx0XCJib3R0b20tcmlnaHRcIlxuXTtcbmV4cG9ydCBmdW5jdGlvbiBpc1ZhbGlkUGxhY2VtZW50KHZhbHVlKSB7XG5cdHJldHVybiBwbGFjZW1lbnRzLm1hcChTdHJpbmcpLmluY2x1ZGVzKHZhbHVlKTtcbn1cbmV4cG9ydCBjbGFzcyBEZXZUb29sYmFyV2luZG93IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuXHRzaGFkb3dSb290O1xuXHRfcGxhY2VtZW50ID0gZGVmYXVsdFNldHRpbmdzLnBsYWNlbWVudDtcblx0Z2V0IHBsYWNlbWVudCgpIHtcblx0XHRyZXR1cm4gdGhpcy5fcGxhY2VtZW50O1xuXHR9XG5cdHNldCBwbGFjZW1lbnQodmFsdWUpIHtcblx0XHRpZiAoIWlzVmFsaWRQbGFjZW1lbnQodmFsdWUpKSB7XG5cdFx0XHRzZXR0aW5ncy5sb2dnZXIuZXJyb3IoYEludmFsaWQgcGxhY2VtZW50OiAke3ZhbHVlfSwgZXhwZWN0ZWQgb25lIG9mICR7cGxhY2VtZW50cy5qb2luKFwiLCBcIil9LCBnb3QgJHt2YWx1ZX0uYCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdHRoaXMuX3BsYWNlbWVudCA9IHZhbHVlO1xuXHRcdHRoaXMudXBkYXRlU3R5bGUoKTtcblx0fVxuXHRzdGF0aWMgb2JzZXJ2ZWRBdHRyaWJ1dGVzID0gW1wicGxhY2VtZW50XCJdO1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXHRcdHRoaXMuc2hhZG93Um9vdCA9IHRoaXMuYXR0YWNoU2hhZG93KHsgbW9kZTogXCJvcGVuXCIgfSk7XG5cdH1cblx0YXN5bmMgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG5cdFx0dGhpcy5zaGFkb3dSb290LmlubmVySFRNTCA9IGBcblx0XHRcdDxzdHlsZT5cblx0XHRcdFx0Omhvc3Qge1xuXHRcdFx0XHRcdGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG5cdFx0XHRcdFx0ZGlzcGxheTogZmxleDtcblx0XHRcdFx0XHRmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuXHRcdFx0XHRcdGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgwZGVnLCAjMTMxNTFBLCAjMTMxNTFBKSwgbGluZWFyLWdyYWRpZW50KDBkZWcsICMzNDM4NDEsICMzNDM4NDEpO1xuXHRcdFx0XHRcdGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoNTIsIDU2LCA2NSwgMSk7XG5cdFx0XHRcdFx0d2lkdGg6IG1pbig2NDBweCwgMTAwJSk7XG5cdFx0XHRcdFx0bWF4LWhlaWdodDogNDgwcHg7XG5cdFx0XHRcdFx0Ym9yZGVyLXJhZGl1czogMTJweDtcblx0XHRcdFx0XHRwYWRkaW5nOiAyNHB4O1xuXHRcdFx0XHRcdGZvbnQtZmFtaWx5OiB1aS1zYW5zLXNlcmlmLCBzeXN0ZW0tdWksIC1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgXCJTZWdvZSBVSVwiLCBSb2JvdG8sIFwiSGVsdmV0aWNhIE5ldWVcIiwgQXJpYWwsIFwiTm90byBTYW5zXCIsIHNhbnMtc2VyaWYsIFwiQXBwbGUgQ29sb3IgRW1vamlcIiwgXCJTZWdvZSBVSSBFbW9qaVwiLCBcIlNlZ29lIFVJIFN5bWJvbFwiLCBcIk5vdG8gQ29sb3IgRW1vamlcIjtcblx0XHRcdFx0XHRjb2xvcjogcmdiYSgxOTEsIDE5MywgMjAxLCAxKTtcblx0XHRcdFx0XHRwb3NpdGlvbjogZml4ZWQ7XG5cdFx0XHRcdFx0ei1pbmRleDogOTk5OTk5OTk5O1xuXHRcdFx0XHRcdGJvdHRvbTogNzJweDtcblx0XHRcdFx0XHRib3gtc2hhZG93OiAwcHggMHB4IDBweCAwcHggcmdiYSgxOSwgMjEsIDI2LCAwLjMwKSwgMHB4IDFweCAycHggMHB4IHJnYmEoMTksIDIxLCAyNiwgMC4yOSksIDBweCA0cHggNHB4IDBweCByZ2JhKDE5LCAyMSwgMjYsIDAuMjYpLCAwcHggMTBweCA2cHggMHB4IHJnYmEoMTksIDIxLCAyNiwgMC4xNSksIDBweCAxN3B4IDdweCAwcHggcmdiYSgxOSwgMjEsIDI2LCAwLjA0KSwgMHB4IDI2cHggN3B4IDBweCByZ2JhKDE5LCAyMSwgMjYsIDAuMDEpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0QG1lZGlhIChmb3JjZWQtY29sb3JzOiBhY3RpdmUpIHtcblx0XHRcdFx0XHQ6aG9zdCB7XG5cdFx0XHRcdFx0XHRiYWNrZ3JvdW5kOiB3aGl0ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRAbWVkaWEgKG1heC13aWR0aDogNjQwcHgpIHtcblx0XHRcdFx0XHQ6aG9zdCB7XG5cdFx0XHRcdFx0XHRib3JkZXItcmFkaXVzOiAwO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdDo6c2xvdHRlZChoMSksIDo6c2xvdHRlZChoMiksIDo6c2xvdHRlZChoMyksIDo6c2xvdHRlZChoNCksIDo6c2xvdHRlZChoNSkge1xuXHRcdFx0XHRcdGZvbnQtd2VpZ2h0OiA2MDA7XG5cdFx0XHRcdFx0Y29sb3I6ICNmZmY7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQ6OnNsb3R0ZWQoaDEpIHtcblx0XHRcdFx0XHRmb250LXNpemU6IDIycHg7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQ6OnNsb3R0ZWQoaDIpIHtcblx0XHRcdFx0XHRmb250LXNpemU6IDIwcHg7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQ6OnNsb3R0ZWQoaDMpIHtcblx0XHRcdFx0XHRmb250LXNpemU6IDE4cHg7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQ6OnNsb3R0ZWQoaDQpIHtcblx0XHRcdFx0XHRmb250LXNpemU6IDE2cHg7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQ6OnNsb3R0ZWQoaDUpIHtcblx0XHRcdFx0XHRmb250LXNpemU6IDE0cHg7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRociwgOjpzbG90dGVkKGhyKSB7XG5cdFx0XHRcdFx0Ym9yZGVyOiAxcHggc29saWQgcmdiYSgyNywgMzAsIDM2LCAxKTtcblx0XHRcdFx0XHRtYXJnaW46IDFlbSAwO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cCwgOjpzbG90dGVkKHApIHtcblx0XHRcdFx0XHRsaW5lLWhlaWdodDogMS41ZW07XG5cdFx0XHRcdH1cblx0XHRcdDwvc3R5bGU+XG5cdFx0XHQ8c3R5bGUgaWQ9XCJzZWxlY3RlZC1zdHlsZVwiPjwvc3R5bGU+XG5cblx0XHRcdDxzbG90IC8+XG5cdFx0YDtcblx0XHR0aGlzLnVwZGF0ZVN0eWxlKCk7XG5cdH1cblx0YXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKCkge1xuXHRcdGlmICh0aGlzLmhhc0F0dHJpYnV0ZShcInBsYWNlbWVudFwiKSkgdGhpcy5wbGFjZW1lbnQgPSB0aGlzLmdldEF0dHJpYnV0ZShcInBsYWNlbWVudFwiKTtcblx0fVxuXHR1cGRhdGVTdHlsZSgpIHtcblx0XHRjb25zdCBzdHlsZSA9IHRoaXMuc2hhZG93Um9vdC5xdWVyeVNlbGVjdG9yKFwiI3NlbGVjdGVkLXN0eWxlXCIpO1xuXHRcdGlmIChzdHlsZSkge1xuXHRcdFx0Y29uc3Qgc3R5bGVNYXAgPSB7XG5cdFx0XHRcdFwiYm90dG9tLWxlZnRcIjogYFxuXHRcdFx0XHRcdDpob3N0IHtcblx0XHRcdFx0XHRcdGxlZnQ6IDE2cHg7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRgLFxuXHRcdFx0XHRcImJvdHRvbS1jZW50ZXJcIjogYFxuXHRcdFx0XHRcdDpob3N0IHtcblx0XHRcdFx0XHRcdGxlZnQ6IDUwJTtcblx0XHRcdFx0XHRcdHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtNTAlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdGAsXG5cdFx0XHRcdFwiYm90dG9tLXJpZ2h0XCI6IGBcblx0XHRcdFx0XHQ6aG9zdCB7XG5cdFx0XHRcdFx0XHRyaWdodDogMTZweDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdGBcblx0XHRcdH07XG5cdFx0XHRzdHlsZS5pbm5lckhUTUwgPSBzdHlsZU1hcFt0aGlzLnBsYWNlbWVudF07XG5cdFx0fVxuXHR9XG59XG4iLCJpbXBvcnQgeyBpc1ZhbGlkUGxhY2VtZW50IH0gZnJvbSBcIi4vdWktbGlicmFyeS93aW5kb3cuanNcIjtcbmV4cG9ydCBjb25zdCBkZWZhdWx0U2V0dGluZ3MgPSB7XG5cdGRpc2FibGVBcHBOb3RpZmljYXRpb246IGZhbHNlLFxuXHR2ZXJib3NlOiBmYWxzZSxcblx0cGxhY2VtZW50OiBcImJvdHRvbS1jZW50ZXJcIlxufTtcbmV4cG9ydCBjb25zdCBzZXR0aW5ncyA9IGdldFNldHRpbmdzKCk7XG5mdW5jdGlvbiBnZXRTZXR0aW5ncygpIHtcblx0Ly8gMS4gU3RhcnQgd2l0aCBoYXJkY29kZWQgZGVmYXVsdHNcblx0bGV0IF9zZXR0aW5ncyA9IHsgLi4uZGVmYXVsdFNldHRpbmdzIH07XG5cdC8vIDIuIE92ZXJyaWRlIHdpdGggY29uZmlnIHBsYWNlbWVudCAoaWYgcHJvdmlkZWQpXG5cdGNvbnN0IGNvbmZpZ1BsYWNlbWVudCA9IGdsb2JhbFRoaXMuX19hc3Ryb19kZXZfdG9vbGJhcl9fPy5wbGFjZW1lbnQ7XG5cdGlmIChjb25maWdQbGFjZW1lbnQgJiYgaXNWYWxpZFBsYWNlbWVudChjb25maWdQbGFjZW1lbnQpKSB7XG5cdFx0X3NldHRpbmdzLnBsYWNlbWVudCA9IGNvbmZpZ1BsYWNlbWVudDtcblx0fVxuXHQvLyAzLiBPdmVycmlkZSB3aXRoIGxvY2FsU3RvcmFnZSAocHJlc2VydmVzIHVzZXIncyBVSSBjaG9pY2UpXG5cdGNvbnN0IHRvb2xiYXJTZXR0aW5ncyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYXN0cm86ZGV2LXRvb2xiYXI6c2V0dGluZ3NcIik7XG5cdGlmICh0b29sYmFyU2V0dGluZ3MpIHtcblx0XHRfc2V0dGluZ3MgPSB7XG5cdFx0XHQuLi5fc2V0dGluZ3MsXG5cdFx0XHQuLi5KU09OLnBhcnNlKHRvb2xiYXJTZXR0aW5ncylcblx0XHR9O1xuXHR9XG5cdGZ1bmN0aW9uIHVwZGF0ZVNldHRpbmcoa2V5LCB2YWx1ZSkge1xuXHRcdF9zZXR0aW5nc1trZXldID0gdmFsdWU7XG5cdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJhc3RybzpkZXYtdG9vbGJhcjpzZXR0aW5nc1wiLCBKU09OLnN0cmluZ2lmeShfc2V0dGluZ3MpKTtcblx0fVxuXHRmdW5jdGlvbiBsb2cobWVzc2FnZSwgbGV2ZWwgPSBcImxvZ1wiKSB7XG5cdFx0Ly8gYmlvbWUtaWdub3JlIGxpbnQvc3VzcGljaW91cy9ub0NvbnNvbGU6IGl0IGNhbid0IGluZmVyIHR5cGVzIHlldFxuXHRcdGNvbnNvbGVbbGV2ZWxdKGAlY0FzdHJvYCwgXCJiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoNjYuNzdkZWcsICNEODMzMzMgMCUsICNGMDQxRkYgMTAwJSk7IGNvbG9yOiB3aGl0ZTsgcGFkZGluZy1pbmxpbmU6IDRweDsgYm9yZGVyLXJhZGl1czogMnB4OyBmb250LWZhbWlseTogbW9ub3NwYWNlO1wiLCBtZXNzYWdlKTtcblx0fVxuXHRyZXR1cm4ge1xuXHRcdGdldCBjb25maWcoKSB7XG5cdFx0XHRyZXR1cm4gX3NldHRpbmdzO1xuXHRcdH0sXG5cdFx0dXBkYXRlU2V0dGluZyxcblx0XHRsb2dnZXI6IHtcblx0XHRcdGxvZyxcblx0XHRcdHdhcm46IChtZXNzYWdlKSA9PiB7XG5cdFx0XHRcdGxvZyhtZXNzYWdlLCBcIndhcm5cIik7XG5cdFx0XHR9LFxuXHRcdFx0ZXJyb3I6IChtZXNzYWdlKSA9PiB7XG5cdFx0XHRcdGxvZyhtZXNzYWdlLCBcImVycm9yXCIpO1xuXHRcdFx0fSxcblx0XHRcdHZlcmJvc2VMb2c6IChtZXNzYWdlKSA9PiB7XG5cdFx0XHRcdGlmIChfc2V0dGluZ3MudmVyYm9zZSkge1xuXHRcdFx0XHRcdGxvZyhtZXNzYWdlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fTtcbn1cbiIsIi8vIEB0cy1leHBlY3QtZXJyb3IgLSBUaGlzIG1vZHVsZSBpcyBwcml2YXRlIGFuZCB1bnR5cGVkXG5pbXBvcnQgeyBsb2FkRGV2VG9vbGJhckFwcHMgfSBmcm9tIFwiYXN0cm86dG9vbGJhcjppbnRlcm5hbFwiO1xuaW1wb3J0IHsgVG9vbGJhckFwcEV2ZW50VGFyZ2V0IH0gZnJvbSBcIi4vaGVscGVycy5qc1wiO1xuaW1wb3J0IHsgc2V0dGluZ3MgfSBmcm9tIFwiLi9zZXR0aW5ncy5qc1wiO1xubGV0IG92ZXJsYXk7XG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBhc3luYyAoKSA9PiB7XG5cdGNvbnN0IFtjdXN0b21BcHBzRGVmaW5pdGlvbnMsIHsgZGVmYXVsdDogYXN0cm9EZXZUb29sQXBwIH0sIHsgZGVmYXVsdDogYXN0cm9BdWRpdEFwcCB9LCB7IGRlZmF1bHQ6IGFzdHJvWHJheUFwcCB9LCB7IGRlZmF1bHQ6IGFzdHJvU2V0dGluZ3NBcHAgfSwgeyBBc3Ryb0RldlRvb2xiYXIsIERldlRvb2xiYXJDYW52YXMsIGdldEFwcEljb24gfSwgeyBEZXZUb29sYmFyQ2FyZCwgRGV2VG9vbGJhckhpZ2hsaWdodCwgRGV2VG9vbGJhclRvb2x0aXAsIERldlRvb2xiYXJXaW5kb3csIERldlRvb2xiYXJUb2dnbGUsIERldlRvb2xiYXJCdXR0b24sIERldlRvb2xiYXJCYWRnZSwgRGV2VG9vbGJhckljb24sIERldlRvb2xiYXJTZWxlY3QsIERldlRvb2xiYXJSYWRpb0NoZWNrYm94IH1dID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuXHRcdGxvYWREZXZUb29sYmFyQXBwcygpLFxuXHRcdGltcG9ydChcIi4vYXBwcy9hc3Ryby5qc1wiKSxcblx0XHRpbXBvcnQoXCIuL2FwcHMvYXVkaXQvaW5kZXguanNcIiksXG5cdFx0aW1wb3J0KFwiLi9hcHBzL3hyYXkuanNcIiksXG5cdFx0aW1wb3J0KFwiLi9hcHBzL3NldHRpbmdzLmpzXCIpLFxuXHRcdGltcG9ydChcIi4vdG9vbGJhci5qc1wiKSxcblx0XHRpbXBvcnQoXCIuL3VpLWxpYnJhcnkvaW5kZXguanNcIilcblx0XSk7XG5cdC8vIFJlZ2lzdGVyIGN1c3RvbSBlbGVtZW50c1xuXHRjdXN0b21FbGVtZW50cy5kZWZpbmUoXCJhc3Ryby1kZXYtdG9vbGJhclwiLCBBc3Ryb0RldlRvb2xiYXIpO1xuXHRjdXN0b21FbGVtZW50cy5kZWZpbmUoXCJhc3Ryby1kZXYtdG9vbGJhci13aW5kb3dcIiwgRGV2VG9vbGJhcldpbmRvdyk7XG5cdGN1c3RvbUVsZW1lbnRzLmRlZmluZShcImFzdHJvLWRldi10b29sYmFyLWFwcC1jYW52YXNcIiwgRGV2VG9vbGJhckNhbnZhcyk7XG5cdGN1c3RvbUVsZW1lbnRzLmRlZmluZShcImFzdHJvLWRldi10b29sYmFyLXRvb2x0aXBcIiwgRGV2VG9vbGJhclRvb2x0aXApO1xuXHRjdXN0b21FbGVtZW50cy5kZWZpbmUoXCJhc3Ryby1kZXYtdG9vbGJhci1oaWdobGlnaHRcIiwgRGV2VG9vbGJhckhpZ2hsaWdodCk7XG5cdGN1c3RvbUVsZW1lbnRzLmRlZmluZShcImFzdHJvLWRldi10b29sYmFyLWNhcmRcIiwgRGV2VG9vbGJhckNhcmQpO1xuXHRjdXN0b21FbGVtZW50cy5kZWZpbmUoXCJhc3Ryby1kZXYtdG9vbGJhci10b2dnbGVcIiwgRGV2VG9vbGJhclRvZ2dsZSk7XG5cdGN1c3RvbUVsZW1lbnRzLmRlZmluZShcImFzdHJvLWRldi10b29sYmFyLWJ1dHRvblwiLCBEZXZUb29sYmFyQnV0dG9uKTtcblx0Y3VzdG9tRWxlbWVudHMuZGVmaW5lKFwiYXN0cm8tZGV2LXRvb2xiYXItYmFkZ2VcIiwgRGV2VG9vbGJhckJhZGdlKTtcblx0Y3VzdG9tRWxlbWVudHMuZGVmaW5lKFwiYXN0cm8tZGV2LXRvb2xiYXItaWNvblwiLCBEZXZUb29sYmFySWNvbik7XG5cdGN1c3RvbUVsZW1lbnRzLmRlZmluZShcImFzdHJvLWRldi10b29sYmFyLXNlbGVjdFwiLCBEZXZUb29sYmFyU2VsZWN0KTtcblx0Y3VzdG9tRWxlbWVudHMuZGVmaW5lKFwiYXN0cm8tZGV2LXRvb2xiYXItcmFkaW8tY2hlY2tib3hcIiwgRGV2VG9vbGJhclJhZGlvQ2hlY2tib3gpO1xuXHRvdmVybGF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFzdHJvLWRldi10b29sYmFyXCIpO1xuXHRjb25zdCBub3RpZmljYXRpb25MZXZlbHMgPSBbXG5cdFx0XCJlcnJvclwiLFxuXHRcdFwid2FybmluZ1wiLFxuXHRcdFwiaW5mb1wiXG5cdF07XG5cdGNvbnN0IG5vdGlmaWNhdGlvblNWR3MgPSB7XG5cdFx0ZXJyb3I6IFwiPHN2ZyB2aWV3Qm94PVxcXCIwIDAgMTAgMTBcXFwiIHN0eWxlPVxcXCItLWZpbGw6dmFyKC0tZmlsbC1kZWZhdWx0KTstLWZpbGwtZGVmYXVsdDojQjMzRTY2Oy0tZmlsbC1ob3ZlcjojRTNBRkMxO1xcXCI+PHJlY3Qgd2lkdGg9XFxcIjlcXFwiIGhlaWdodD1cXFwiOVxcXCIgeD1cXFwiLjVcXFwiIHk9XFxcIi41XFxcIiBmaWxsPVxcXCJ2YXIoLS1maWxsKVxcXCIgc3Ryb2tlPVxcXCIjMTMxNTFBXFxcIiBzdHJva2Utd2lkdGg9XFxcIjJcXFwiIHJ4PVxcXCI0LjVcXFwiLz48L3N2Zz5cIixcblx0XHR3YXJuaW5nOiBcIjxzdmcgd2lkdGg9XFxcIjEyXFxcIiBoZWlnaHQ9XFxcIjEwXFxcIiBmaWxsPVxcXCJub25lXFxcIiBzdHlsZT1cXFwiLS1maWxsOnZhcigtLWZpbGwtZGVmYXVsdCk7LS1maWxsLWRlZmF1bHQ6I0I1OEEyRDstLWZpbGwtaG92ZXI6I0Q1Qjc3NjtcXFwiPjxwYXRoIGZpbGw9XFxcInZhcigtLWZpbGwpXFxcIiBzdHJva2U9XFxcIiMxMzE1MUFcXFwiIHN0cm9rZS13aWR0aD1cXFwiMlxcXCIgZD1cXFwiTTcuMjk5MDQgMS4yNWMtLjU3NzM1LTEtMi4wMjA3My0xLTIuNTk4MDggMGwtMy40NjQxIDZDLjY1OTUxIDguMjUgMS4zODEyIDkuNSAyLjUzNTkgOS41aDYuOTI4MmMxLjE1NDcgMCAxLjg3NjQtMS4yNSAxLjI5OS0yLjI1bC0zLjQ2NDA2LTZaXFxcIi8+PC9zdmc+XCIsXG5cdFx0aW5mbzogXCI8c3ZnIHZpZXdCb3g9XFxcIjAgMCAxMCAxMFxcXCIgc3R5bGU9XFxcIi0tZmlsbDp2YXIoLS1maWxsLWRlZmF1bHQpOy0tZmlsbC1kZWZhdWx0OiMzNjQ1RDk7LS1maWxsLWhvdmVyOiNCREMzRkY7XFxcIj48cmVjdCB3aWR0aD1cXFwiOVxcXCIgaGVpZ2h0PVxcXCI5XFxcIiB4PVxcXCIuNVxcXCIgeT1cXFwiLjVcXFwiIGZpbGw9XFxcInZhcigtLWZpbGwpXFxcIiBzdHJva2U9XFxcIiMxMzE1MUFcXFwiIHN0cm9rZS13aWR0aD1cXFwiMlxcXCIgcng9XFxcIjEuNVxcXCIvPjwvc3ZnPlwiXG5cdH07XG5cdGNvbnN0IHByZXBhcmVBcHAgPSAoYXBwRGVmaW5pdGlvbiwgYnVpbHRJbikgPT4ge1xuXHRcdGNvbnN0IGV2ZW50VGFyZ2V0ID0gbmV3IFRvb2xiYXJBcHBFdmVudFRhcmdldCgpO1xuXHRcdGNvbnN0IGFwcCA9IHtcblx0XHRcdC4uLmFwcERlZmluaXRpb24sXG5cdFx0XHRidWlsdEluLFxuXHRcdFx0YWN0aXZlOiBmYWxzZSxcblx0XHRcdHN0YXR1czogXCJsb2FkaW5nXCIsXG5cdFx0XHRub3RpZmljYXRpb246IHtcblx0XHRcdFx0c3RhdGU6IGZhbHNlLFxuXHRcdFx0XHRsZXZlbDogdW5kZWZpbmVkXG5cdFx0XHR9LFxuXHRcdFx0ZXZlbnRUYXJnZXRcblx0XHR9O1xuXHRcdC8vIEV2ZW50cyBhcHBzIGNhbiBzZW5kIHRvIHRoZSBvdmVybGF5IHRvIHVwZGF0ZSB0aGVpciBzdGF0dXNcblx0XHRldmVudFRhcmdldC5hZGRFdmVudExpc3RlbmVyKFwidG9nZ2xlLW5vdGlmaWNhdGlvblwiLCAoZXZ0KSA9PiB7XG5cdFx0XHRpZiAoIShldnQgaW5zdGFuY2VvZiBDdXN0b21FdmVudCkpIHJldHVybjtcblx0XHRcdGNvbnN0IHRhcmdldCA9IG92ZXJsYXkuc2hhZG93Um9vdD8ucXVlcnlTZWxlY3RvcihgW2RhdGEtYXBwLWlkPVwiJHthcHAuaWR9XCJdYCk7XG5cdFx0XHRpZiAoIXRhcmdldCkgcmV0dXJuO1xuXHRcdFx0Y29uc3Qgbm90aWZpY2F0aW9uRWxlbWVudCA9IHRhcmdldC5xdWVyeVNlbGVjdG9yKFwiLm5vdGlmaWNhdGlvblwiKTtcblx0XHRcdGlmICghbm90aWZpY2F0aW9uRWxlbWVudCkgcmV0dXJuO1xuXHRcdFx0bGV0IG5ld1N0YXRlID0gZXZ0LmRldGFpbC5zdGF0ZSA/PyB0cnVlO1xuXHRcdFx0bGV0IGxldmVsID0gbm90aWZpY2F0aW9uTGV2ZWxzLmluY2x1ZGVzKGV2dD8uZGV0YWlsPy5sZXZlbCkgPyBldnQuZGV0YWlsLmxldmVsIDogXCJlcnJvclwiO1xuXHRcdFx0YXBwLm5vdGlmaWNhdGlvbi5zdGF0ZSA9IG5ld1N0YXRlO1xuXHRcdFx0aWYgKG5ld1N0YXRlKSBhcHAubm90aWZpY2F0aW9uLmxldmVsID0gbGV2ZWw7XG5cdFx0XHRub3RpZmljYXRpb25FbGVtZW50LnRvZ2dsZUF0dHJpYnV0ZShcImRhdGEtYWN0aXZlXCIsIG5ld1N0YXRlKTtcblx0XHRcdGlmIChuZXdTdGF0ZSkge1xuXHRcdFx0XHRub3RpZmljYXRpb25FbGVtZW50LnNldEF0dHJpYnV0ZShcImRhdGEtbGV2ZWxcIiwgbGV2ZWwpO1xuXHRcdFx0XHRub3RpZmljYXRpb25FbGVtZW50LmlubmVySFRNTCA9IG5vdGlmaWNhdGlvblNWR3NbbGV2ZWxdO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdGNvbnN0IG9uVG9nZ2xlQXBwID0gYXN5bmMgKGV2dCkgPT4ge1xuXHRcdFx0bGV0IG5ld1N0YXRlID0gdW5kZWZpbmVkO1xuXHRcdFx0aWYgKGV2dCBpbnN0YW5jZW9mIEN1c3RvbUV2ZW50KSB7XG5cdFx0XHRcdG5ld1N0YXRlID0gZXZ0LmRldGFpbC5zdGF0ZSA/PyB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0YXdhaXQgb3ZlcmxheS5zZXRBcHBTdGF0dXMoYXBwLCBuZXdTdGF0ZSk7XG5cdFx0fTtcblx0XHRldmVudFRhcmdldC5hZGRFdmVudExpc3RlbmVyKFwidG9nZ2xlLWFwcFwiLCBvblRvZ2dsZUFwcCk7XG5cdFx0cmV0dXJuIGFwcDtcblx0fTtcblx0Y29uc3QgYXN0cm9Nb3JlQXBwID0ge1xuXHRcdGlkOiBcImFzdHJvOm1vcmVcIixcblx0XHRuYW1lOiBcIk1vcmVcIixcblx0XHRpY29uOiBcImRvdHMtdGhyZWVcIixcblx0XHRpbml0KGNhbnZhcywgZXZlbnRUYXJnZXQpIHtcblx0XHRcdGNvbnN0IGhpZGRlbkFwcHMgPSBhcHBzLmZpbHRlcigocCkgPT4gIXAuYnVpbHRJbikuc2xpY2Uob3ZlcmxheS5jdXN0b21BcHBzVG9TaG93KTtcblx0XHRcdGNyZWF0ZURyb3Bkb3duKCk7XG5cdFx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiYXN0cm86YWZ0ZXItc3dhcFwiLCBjcmVhdGVEcm9wZG93bik7XG5cdFx0XHRmdW5jdGlvbiBjcmVhdGVEcm9wZG93bigpIHtcblx0XHRcdFx0Y29uc3Qgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG5cdFx0XHRcdHN0eWxlLmlubmVySFRNTCA9IGBcblx0XHRcdFx0XHQjZHJvcGRvd24ge1xuXHRcdFx0XHRcdFx0YmFja2dyb3VuZDogcmdiYSgxOSwgMjEsIDI2LCAxKTtcblx0XHRcdFx0XHRcdGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoNTIsIDU2LCA2NSwgMSk7XG5cdFx0XHRcdFx0XHRib3JkZXItcmFkaXVzOiAxMnB4O1xuXHRcdFx0XHRcdFx0Ym94LXNoYWRvdzogMHB4IDBweCAwcHggMHB4IHJnYmEoMTksIDIxLCAyNiwgMC4zMCksIDBweCAxcHggMnB4IDBweCByZ2JhKDE5LCAyMSwgMjYsIDAuMjkpLCAwcHggNHB4IDRweCAwcHggcmdiYSgxOSwgMjEsIDI2LCAwLjI2KSwgMHB4IDEwcHggNnB4IDBweCByZ2JhKDE5LCAyMSwgMjYsIDAuMTUpLCAwcHggMTdweCA3cHggMHB4IHJnYmEoMTksIDIxLCAyNiwgMC4wNCksIDBweCAyNnB4IDdweCAwcHggcmdiYSgxOSwgMjEsIDI2LCAwLjAxKTtcblx0XHRcdFx0XHRcdHdpZHRoOiAxOTJweDtcblx0XHRcdFx0XHRcdHBhZGRpbmc6IDhweDtcblx0XHRcdFx0XHRcdHotaW5kZXg6IDIwMDAwMDAwMTA7XG5cdFx0XHRcdFx0XHR0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAwJSk7XG5cdFx0XHRcdFx0XHRwb3NpdGlvbjogZml4ZWQ7XG5cdFx0XHRcdFx0XHRib3R0b206IDcycHg7XG5cdFx0XHRcdFx0XHRsZWZ0OiA1MCU7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Lm5vdGlmaWNhdGlvbiB7XG5cdFx0XHRcdFx0XHRkaXNwbGF5OiBub25lO1xuXHRcdFx0XHRcdFx0cG9zaXRpb246IGFic29sdXRlO1xuXHRcdFx0XHRcdFx0dG9wOiAtNHB4O1xuXHRcdFx0XHRcdFx0cmlnaHQ6IC01cHg7XG5cdFx0XHRcdFx0XHR3aWR0aDogMTJweDtcblx0XHRcdFx0XHRcdGhlaWdodDogMTBweDtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQubm90aWZpY2F0aW9uIHN2ZyB7XG5cdFx0XHRcdFx0XHRkaXNwbGF5OiBibG9jaztcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQjZHJvcGRvd246bm90KFtkYXRhLW5vLW5vdGlmaWNhdGlvbl0pIC5ub3RpZmljYXRpb25bZGF0YS1hY3RpdmVdIHtcblx0XHRcdFx0XHRcdGRpc3BsYXk6IGJsb2NrO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdCNkcm9wZG93biBidXR0b24ge1xuXHRcdFx0XHRcdFx0Ym9yZGVyOiAwO1xuXHRcdFx0XHRcdFx0YmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XG5cdFx0XHRcdFx0XHRjb2xvcjogd2hpdGU7XG5cdFx0XHRcdFx0XHRmb250LWZhbWlseTogc3lzdGVtLXVpLCBzYW5zLXNlcmlmO1xuXHRcdFx0XHRcdFx0Zm9udC1zaXplOiAxNHB4O1xuXHRcdFx0XHRcdFx0d2hpdGUtc3BhY2U6IG5vd3JhcDtcblx0XHRcdFx0XHRcdHRleHQtZGVjb3JhdGlvbjogbm9uZTtcblx0XHRcdFx0XHRcdG1hcmdpbjogMDtcblx0XHRcdFx0XHRcdGRpc3BsYXk6IGZsZXg7XG5cdFx0XHRcdFx0XHRhbGlnbi1pdGVtczogY2VudGVyO1xuXHRcdFx0XHRcdFx0d2lkdGg6IDEwMCU7XG5cdFx0XHRcdFx0XHRwYWRkaW5nOiA4cHg7XG5cdFx0XHRcdFx0XHRib3JkZXItcmFkaXVzOiA4cHg7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0I2Ryb3Bkb3duIGJ1dHRvbjpob3ZlciwgI2Ryb3Bkb3duIGJ1dHRvbjpmb2N1cy12aXNpYmxlIHtcblx0XHRcdFx0XHRcdGJhY2tncm91bmQ6ICNGRkZGRkYyMDtcblx0XHRcdFx0XHRcdGN1cnNvcjogcG9pbnRlcjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQjZHJvcGRvd24gYnV0dG9uLmFjdGl2ZSB7XG5cdFx0XHRcdFx0XHRiYWNrZ3JvdW5kOiByZ2JhKDcxLCA3OCwgOTQsIDEpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdCNkcm9wZG93biAuaWNvbiB7XG5cdFx0XHRcdFx0XHRwb3NpdGlvbjogcmVsYXRpdmU7XG5cdFx0XHRcdFx0XHRoZWlnaHQ6IDIwcHg7XG5cdFx0XHRcdFx0XHR3aWR0aDogMjBweDtcblx0XHRcdFx0XHRcdHBhZGRpbmc6IDFweDtcblx0XHRcdFx0XHRcdG1hcmdpbi1yaWdodDogMC41ZW07XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0I2Ryb3Bkb3duIC5pY29uIHN2ZyB7XG5cdFx0XHRcdFx0XHRtYXgtaGVpZ2h0OiAxMDAlO1xuXHRcdFx0XHRcdFx0bWF4LXdpZHRoOiAxMDAlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0YDtcblx0XHRcdFx0Y2FudmFzLmFwcGVuZChzdHlsZSk7XG5cdFx0XHRcdGNvbnN0IGRyb3Bkb3duID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0XHRcdFx0ZHJvcGRvd24uaWQgPSBcImRyb3Bkb3duXCI7XG5cdFx0XHRcdGRyb3Bkb3duLnRvZ2dsZUF0dHJpYnV0ZShcImRhdGEtbm8tbm90aWZpY2F0aW9uXCIsIHNldHRpbmdzLmNvbmZpZy5kaXNhYmxlQXBwTm90aWZpY2F0aW9uKTtcblx0XHRcdFx0Zm9yIChjb25zdCBhcHAgb2YgaGlkZGVuQXBwcykge1xuXHRcdFx0XHRcdGNvbnN0IGJ1dHRvbkNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdFx0XHRcdFx0YnV0dG9uQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJpdGVtXCIpO1xuXHRcdFx0XHRcdGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG5cdFx0XHRcdFx0YnV0dG9uLnNldEF0dHJpYnV0ZShcImRhdGEtYXBwLWlkXCIsIGFwcC5pZCk7XG5cdFx0XHRcdFx0Y29uc3QgaWNvbkNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdFx0XHRcdFx0Y29uc3QgaWNvbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGVtcGxhdGVcIik7XG5cdFx0XHRcdFx0aWNvbkVsZW1lbnQuaW5uZXJIVE1MID0gYXBwLmljb24gPyBnZXRBcHBJY29uKGFwcC5pY29uKSA6IFwiP1wiO1xuXHRcdFx0XHRcdGljb25Db250YWluZXIuYXBwZW5kKGljb25FbGVtZW50LmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpKTtcblx0XHRcdFx0XHRjb25zdCBub3RpZmljYXRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRcdFx0XHRcdG5vdGlmaWNhdGlvbi5jbGFzc0xpc3QuYWRkKFwibm90aWZpY2F0aW9uXCIpO1xuXHRcdFx0XHRcdGljb25Db250YWluZXIuYXBwZW5kKG5vdGlmaWNhdGlvbik7XG5cdFx0XHRcdFx0aWNvbkNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiaWNvblwiKTtcblx0XHRcdFx0XHRidXR0b24uYXBwZW5kKGljb25Db250YWluZXIpO1xuXHRcdFx0XHRcdGJ1dHRvbi5hcHBlbmQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYXBwLm5hbWUpKTtcblx0XHRcdFx0XHRidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcblx0XHRcdFx0XHRcdG92ZXJsYXkudG9nZ2xlQXBwU3RhdHVzKGFwcCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0YnV0dG9uQ29udGFpbmVyLmFwcGVuZChidXR0b24pO1xuXHRcdFx0XHRcdGRyb3Bkb3duLmFwcGVuZChidXR0b25Db250YWluZXIpO1xuXHRcdFx0XHRcdGFwcC5ldmVudFRhcmdldC5hZGRFdmVudExpc3RlbmVyKFwidG9nZ2xlLW5vdGlmaWNhdGlvblwiLCAoZXZ0KSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAoIShldnQgaW5zdGFuY2VvZiBDdXN0b21FdmVudCkpIHJldHVybjtcblx0XHRcdFx0XHRcdGxldCBuZXdTdGF0ZSA9IGV2dC5kZXRhaWwuc3RhdGUgPz8gdHJ1ZTtcblx0XHRcdFx0XHRcdGxldCBsZXZlbCA9IG5vdGlmaWNhdGlvbkxldmVscy5pbmNsdWRlcyhldnQ/LmRldGFpbD8ubGV2ZWwpID8gZXZ0LmRldGFpbC5sZXZlbCA6IFwiZXJyb3JcIjtcblx0XHRcdFx0XHRcdG5vdGlmaWNhdGlvbi50b2dnbGVBdHRyaWJ1dGUoXCJkYXRhLWFjdGl2ZVwiLCBuZXdTdGF0ZSk7XG5cdFx0XHRcdFx0XHRpZiAobmV3U3RhdGUpIHtcblx0XHRcdFx0XHRcdFx0bm90aWZpY2F0aW9uLnNldEF0dHJpYnV0ZShcImRhdGEtbGV2ZWxcIiwgbGV2ZWwpO1xuXHRcdFx0XHRcdFx0XHRub3RpZmljYXRpb24uaW5uZXJIVE1MID0gbm90aWZpY2F0aW9uU1ZHc1tsZXZlbF07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRhcHAubm90aWZpY2F0aW9uLnN0YXRlID0gbmV3U3RhdGU7XG5cdFx0XHRcdFx0XHRpZiAobmV3U3RhdGUpIGFwcC5ub3RpZmljYXRpb24ubGV2ZWwgPSBsZXZlbDtcblx0XHRcdFx0XHRcdGV2ZW50VGFyZ2V0LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KFwidG9nZ2xlLW5vdGlmaWNhdGlvblwiLCB7IGRldGFpbDoge1xuXHRcdFx0XHRcdFx0XHRzdGF0ZTogaGlkZGVuQXBwcy5zb21lKChwKSA9PiBwLm5vdGlmaWNhdGlvbi5zdGF0ZSA9PT0gdHJ1ZSksXG5cdFx0XHRcdFx0XHRcdGxldmVsOiBbXG5cdFx0XHRcdFx0XHRcdFx0XCJlcnJvclwiLFxuXHRcdFx0XHRcdFx0XHRcdFwid2FybmluZ1wiLFxuXHRcdFx0XHRcdFx0XHRcdFwiaW5mb1wiXG5cdFx0XHRcdFx0XHRcdF0uZmluZCgobm90aWZpY2F0aW9uTGV2ZWwpID0+IGhpZGRlbkFwcHMuc29tZSgocCkgPT4gcC5ub3RpZmljYXRpb24uc3RhdGUgPT09IHRydWUgJiYgcC5ub3RpZmljYXRpb24ubGV2ZWwgPT09IG5vdGlmaWNhdGlvbkxldmVsKSkgPz8gXCJlcnJvclwiXG5cdFx0XHRcdFx0XHR9IH0pKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjYW52YXMuYXBwZW5kKGRyb3Bkb3duKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cdGNvbnN0IGFwcHMgPSBbLi4uW1xuXHRcdGFzdHJvRGV2VG9vbEFwcCxcblx0XHRhc3Ryb1hyYXlBcHAsXG5cdFx0YXN0cm9BdWRpdEFwcCxcblx0XHRhc3Ryb1NldHRpbmdzQXBwLFxuXHRcdGFzdHJvTW9yZUFwcFxuXHRdLm1hcCgoYXBwRGVmKSA9PiBwcmVwYXJlQXBwKGFwcERlZiwgdHJ1ZSkpLCAuLi5jdXN0b21BcHBzRGVmaW5pdGlvbnMubWFwKChhcHBEZWYpID0+IHByZXBhcmVBcHAoYXBwRGVmLCBmYWxzZSkpXTtcblx0b3ZlcmxheS5hcHBzID0gYXBwcztcblx0ZG9jdW1lbnQuYm9keS5hcHBlbmQob3ZlcmxheSk7XG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJhc3RybzphZnRlci1zd2FwXCIsICgpID0+IHtcblx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZChvdmVybGF5KTtcblx0fSk7XG59KTtcbiJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFhLHdCQUFiLGNBQTJDLFlBQVk7Q0FDdEQsY0FBYztFQUNiLE1BQU07Q0FDUDs7Ozs7OztDQU9BLG1CQUFtQixTQUFTO0VBQzNCLEtBQUssY0FBYyxJQUFJLFlBQVksdUJBQXVCLEVBQUUsUUFBUTtHQUNuRSxPQUFPLFFBQVE7R0FDZixPQUFPLFFBQVEsVUFBVSxPQUFPLFFBQVEsUUFBUSxLQUFBO0VBQ2pELEVBQUUsQ0FBQyxDQUFDO0NBQ0w7Ozs7OztDQU1BLFlBQVksU0FBUztFQUNwQixLQUFLLGNBQWMsSUFBSSxZQUFZLGNBQWMsRUFBRSxRQUFRLEVBQUUsT0FBTyxRQUFRLE1BQU0sRUFBRSxDQUFDLENBQUM7Q0FDdkY7Ozs7O0NBS0EsVUFBVSxVQUFVO0VBQ25CLEtBQUssaUJBQWlCLGdCQUFnQixRQUFRO0dBQzdDLElBQUksRUFBRSxlQUFlLGNBQWM7R0FDbkMsU0FBUyxJQUFJLE1BQU07RUFDcEIsQ0FBQztDQUNGOzs7OztDQUtBLDBCQUEwQixVQUFVO0VBQ25DLEtBQUssaUJBQWlCLHNCQUFzQixRQUFRO0dBQ25ELElBQUksRUFBRSxlQUFlLGNBQWM7R0FDbkMsU0FBUyxJQUFJLE1BQU07RUFDcEIsQ0FBQztDQUNGO0FBQ0Q7QUFDQSxJQUFhLGdCQUFnQjs7Ozs7Ozs7O0NBUzVCLE9BQU8sT0FBTyxZQUFZO0VBQ3pCLElBQUksWUFBWSxLQUNmLFlBQVksSUFBSSxLQUFLLE9BQU8sT0FBTztDQUVyQzs7Ozs7OztDQU9BLEtBQUssT0FBTyxhQUFhO0VBQ3hCLElBQUksWUFBWSxLQUNmLFlBQVksSUFBSSxHQUFHLE9BQU8sUUFBUTtDQUVwQztBQUNEOzs7QUNyRUEsSUFBYSxhQUFhO0NBQ3pCO0NBQ0E7Q0FDQTtBQUNEO0FBQ0EsU0FBZ0IsaUJBQWlCLE9BQU87Q0FDdkMsT0FBTyxXQUFXLElBQUks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Q3pDLE1BQU0sZ0JBQWdCLFNBQVMsY0FBYyxLQUFLO01BQ2xELE1BQU0sY0FBYyxTQUFTLGNBQWMsVUFBVTtNQUNyRCxZQUFZLFlBQVksSUFBSSxPQUFPLFdBQVcsSUFBSSxJQUFJLElBQUk7TUFDMUQsY0FBYyxPQUFPLFlBQVksUUFBUSxVQUFVLElBQUksQ0FBQztNQUN4RCxNQUFNLGVBQWUsU0FBUyxjQUFjLEtBQUs7TUFDakQsYUFBYSxVQUFVLElBQUksY0FBYztNQUN6QyxjQUFjLE9BQU8sWUFBWTtNQUNqQyxjQUFjLFVBQVUsSUFBSSxNQUFNO01BQ2xDLE9BQU8sT0FBTyxhQUFhO01BQzNCLE9BQU8sT0FBTyxTQUFTLGVBQWUsSUFBSSxJQUFJLENBQUM7TUFDL0MsT0FBTyxpQkFBaUIsZUFBZTtPQUN0QyxRQUFRLGdCQUFnQixHQUFHO01BQzVCLENBQUM7TUFDRCxnQkFBZ0IsT0FBTyxNQUFNO01BQzdCLFNBQVMsT0FBTyxlQUFlO01BQy9CLElBQUksWUFBWSxpQkFBaUIsd0JBQXdCLFFBQVE7T0FDaEUsSUFBSSxFQUFFLGVBQWUsY0FBYztPQUNuQyxJQUFJLFdBQVcsSUFBSSxPQUFPLFNBQVM7T0FDbkMsSUFBSSxRQUFRLG1CQUFtQixTQUFTLEtBQUssUUFBUSxLQUFLLElBQUksSUFBSSxPQUFPLFFBQVE7T0FDakYsYUFBYSxnQkFBZ0IsZUFBZSxRQUFRO09BQ3BELElBQUksVUFBVTtRQUNiLGFBQWEsYUFBYSxjQUFjLEtBQUs7UUFDN0MsYUFBYSxZQUFZLGlCQUFpQjtPQUMzQztPQUNBLElBQUksYUFBYSxRQUFRO09BQ3pCLElBQUksVUFBVSxJQUFJLGFBQWEsUUFBUTtPQUN2QyxZQUFZLGNBQWMsSUFBSSxZQUFZLHVCQUF1QixFQUFFLFFBQVE7UUFDMUUsT0FBTyxXQUFXLE1BQU0sTUFBTSxFQUFFLGFBQWEsVUFBVSxJQUFJO1FBQzNELE9BQU87U0FDTjtTQUNBO1NBQ0E7UUFDRCxDQUFDLENBQUMsTUFBTSxzQkFBc0IsV0FBVyxNQUFNLE1BQU0sRUFBRSxhQUFhLFVBQVUsUUFBUSxFQUFFLGFBQWEsVUFBVSxpQkFBaUIsQ0FBQyxLQUFLO09BQ3ZJLEVBQUUsQ0FBQyxDQUFDO01BQ0wsQ0FBQztLQUNGO0tBQ0EsT0FBTyxPQUFPLFFBQVE7SUFDdkI7R0FDRDtFQU9XO0NBQ1osQ0FBQyxDQUFDLEtBQUssV0FBVyxXQUFXLFFBQVEsSUFBSSxDQUFDLEdBQUcsR0FBRyxzQkFBc0IsS0FBSyxXQUFXLFdBQVcsUUFBUSxLQUFLLENBQUMsQ0FBQztDQUNoSCxRQUFRLE9BQU87Q0FDZixTQUFTLEtBQUssT0FBTyxPQUFPO0NBQzVCLFNBQVMsaUJBQWlCLDBCQUEwQjtFQUNuRCxTQUFTLEtBQUssT0FBTyxPQUFPO0NBQzdCLENBQUM7QUFDRixDQUFDIiwieF9nb29nbGVfaWdub3JlTGlzdCI6WzAsMSwyLDNdfQ==