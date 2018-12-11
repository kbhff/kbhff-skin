Util.Objects["page"] = new function() {
	this.init = function(page) {

		// header reference
		page.hN = u.qs("#header");
		page.hN.ul_service = u.qs("ul.servicenavigation", page.hN);

		// content reference
		page.cN = u.qs("#content", page);

		// navigation reference
		page.nN = u.qs("#navigation", page);
		page.nN = page.insertBefore(page.nN, page.cN);

		// footer reference
		page.fN = u.qs("#footer");
		page.fN.ul_service = u.qs("ul.servicenavigation", page.fN);


		// global resize handler 
		page.resized = function() {
			// u.bug("page.resized:" + u.nodeId(this));

			this.browser_h = u.browserH();
			this.browser_w = u.browserW();

			// adjust content height
			this.available_height = this.browser_h - this.hN.offsetHeight - this.nN.offsetHeight - this.fN.offsetHeight;

//			u.bug("page.cN.offsetHeight:" + page.cN.offsetHeight)

			u.as(this.cN, "min-height", "auto");
			if(this.available_height >= this.cN.offsetHeight) {
				u.as(this.cN, "min-height", this.available_height+"px", false);
			}


			// forward scroll event to current scene
			if(this.cN && this.cN.scene && typeof(this.cN.scene.resized) == "function") {
				this.cN.scene.resized();
			}
		}

		// global scroll handler 
		page.scrolled = function() {
			// u.bug("page.scrolled:" + u.nodeId(this));

			page.scrolled_y = u.scrollY();

			// forward scroll event to current scene
			if(this.cN && this.cN.scene && typeof(this.cN.scene.scrolled) == "function") {
				this.cN.scene.scrolled();
			}
		}

		// Page is ready
		page.ready = function() {
			u.bug("page.ready:" + u.nodeId(this));

			// page is ready to be shown - only initalize if not already shown
			if(!this.is_ready) {

				// page is ready
				this.is_ready = true;

				this.cN.scene = u.qs(".scene", this);

				// set resize handler
				u.e.addWindowEvent(this, "resize", this.resized);
				// set scroll handler
				u.e.addWindowEvent(this, "scroll", this.scrolled);

				// Initialize header
				this.initHeader();

				// Initialize navigation
				this.initNavigation();

				// Initial size adjustment
				this.resized();
			}

		}

		// initialize header
		page.initHeader = function() {
			var logo = u.ie(this.hN, "a", {"class":"logo", "href":"/","html": 'KBHFF <span class="highlight">' + document.title + '</span>'});
			u.ce(logo, {"type":"link"});
			
			var frontpage_link = u.qs("li.front a", this.nN);
			if(frontpage_link) {
				frontpage_link.parentNode.remove();
			}

		}

		// initialize navigation
		page.initNavigation = function() {

			page.nN_nodes = u.qsa("li.nav-node-primary", page.nN);
			
			for (var i = 0; i < page.nN_nodes.length; i++) {
				var nav_node = page.nN_nodes[i];
				nav_node.subnav = u.qs("ul", nav_node);
								
				if (nav_node.subnav) {
					u.e.hover(nav_node, {
						"delay":"200"
					});
					nav_node.over = function(event) {
						u.ass(this.subnav, {
							"transition":"all 0.2s ease-out",
							"visibility":"visible",
							"opacity":"1"
						})
					}
					
					nav_node.out = function(event) {
						u.ass(this.subnav, {
							"transition":"all 0.3s ease-out",
							"visibility":"hidden",
							"opacity":"0"
						})
					}
				}
			}
		}

		// ready to start page builing process
		page.ready();
	}
}

u.e.addDOMReadyEvent(u.init);
