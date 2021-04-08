define([
   'underscore',
   'jquery',
   '../BaseModule',
   'logger',
   'utils',
   'labels',
   'settings-core',
   'lib/hbs/handlebars'
], function(_, $, BaseModule, Logger, Utils, labels, CoreSettings,Handlebars) {
   'use strict';
   Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
      return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
   });
   return BaseModule.extend({
      templateUrl: "templates/global-popup/globalPopup",

      events: {
			"click button.confirm": "onConfirm",
			// "keydown .tb-container a": "onToolboxItemKeyDown"
      },
      
      initialize: function(options) {
         
          this.options = options;
          this.ui.target = $(options.target);
          // this.router = this.options.router;

          this.setListeners();

          this.render();
      },

      setListeners: function(){
         $(this).on("GlobalPopupController:updatePopup", _.bind(this.updateViewed, this));
      },

      serializeData: function(data) {
          return {
            popupId: data.id,
          //    subs: this.subs,
             popupTitle: data.title ,
             CoreSettings: CoreSettings,
             //Start to header 3 (H3), because content will be outputed after a H2
             startingHeader: 3,
             message: data.message,
             type: data.type ? data.type : "alert",
             event: data.event,
             labels:data.labels
          };
       },
 
      render: function() {
          this.tmpl = this.template(this.serializeData(this.options));
          //append the sitemap right in the body
          //this allows to keep track of viewed pages,
          //and also help populate the mod-index with the viewed pages
          //because magnificPopup removes the sitemap each time it closes...
          $('body').append(this.tmpl);
          // this.resetUI();
          // this.bindElements(this.ui.sitemapContainer);
          this.setMagnificPopupTemplate(this.options);

          // this.setModuleIndexHtml();
      },

      setMagnificPopupTemplate: function(data) {
          this.ui.target.magnificPopup({
             items: { src: this.template(this.serializeData(data)) },
             type: 'inline'
          });
       },

       updateViewed: function(data) {
         
         this.tmpl = this.template(this.serializeData());
         this.ui.sitemapContainer.html(this.tmpl);
         this.setMagnificPopupTemplate();
      },

      onConfirm: function(event){
         var eventName = $(event.target).attr("data-event");
         // $("document").trigger(eventName);
         $(this).trigger(eventName);
      }
   });
});