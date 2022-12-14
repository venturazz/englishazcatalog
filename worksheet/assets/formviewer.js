/* FormViewer - v1.1.2 | Copyright 2022 IDRsolutions */
!function(){"use strict";var s,u,a,c,l,f,m,t,o,n,i,r,x,d,g,p,O,e,T,V,H,k,R,h,z,v,E,L,D,S,b,C,F={LAYOUT_CONTINUOUS:"continuous",SELECT_SELECT:"select",SELECT_PAN:"pan",ZOOM_SPECIFIC:"specific",ZOOM_ACTUALSIZE:"actualsize",ZOOM_FITWIDTH:"fitwidth",ZOOM_FITHEIGHT:"fitheight",ZOOM_FITPAGE:"fitpage",ZOOM_AUTO:"auto"},A=1,w=0,Y=[],Z=[],I=10,y={},P=!1,B=(F.setup=function(e){e=e||FormViewer.config,P=!0,a=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),c=e.bounds,w=e.pagecount,e.url&&e.url,m=!!e.isR2L,s=N("formviewer"),m&&U.addClass(s,"isR2L"),_.setup();var t=document.createElement("style");t.setAttribute("type","text/css"),document.head.appendChild(t),t.sheet,(A<1||w<A)&&(A=1);for(var o=0;o<w&&(c[o][0]==c[0][0]&&c[o][1]==c[0][1]);o++);f!==FormViewer.LAYOUT_CONTINUOUS&&(f=FormViewer.LAYOUT_CONTINUOUS);t=[F.LAYOUT_CONTINUOUS];for(f===FormViewer.LAYOUT_CONTINUOUS&&(u=X),window.addEventListener("resize",function(){_.updateZoom()}),l=N("overlay"),M.setup(),(m=null==(m=N("contentContainer"))?N("mainXFAForm"):m).style.transform="translateZ(0)",m.style.padding=I/2+"px",o=1;o<=w;o++){var n=N("page"+o);n.setAttribute("style","width: "+c[o-1][0]+"px; height: "+c[o-1][1]+"px;"),Z[o]=n,Y[o]=B(n,o)}u.setup(A),U.addClass(s,"layout-"+u.toString()),_.updateZoomToDefault(),u.goToPage(A);var i,r={selectMode:M.currentSelectMode,isMobile:a,layout:u.toString(),availableLayouts:t,isFirstPage:1===A,isLastPage:u.isLastPage(A)};for(i in e)e.hasOwnProperty(i)&&(r[i]=e[i]);r.page=A,F.fire("ready",r)},function(e,t){var o={isVisible:function(){return!0},isLoaded:function(){return!0},hide:function(){},unload:function(){F.fire("pageunload",{page:t})},load:function(){F.fire("pageload",{page:t})}};return o}),G=function(e){A!=e&&(A=e,F.fire("pagechange",{page:A,pagecount:w,isFirstPage:1===A,isLastPage:u.isLastPage(e)}))},X=(n=o=0,i=[],(t={}).setup=function(){s.addEventListener("scroll",r);for(var e=0;e<w;e++)c[e][0]>o&&(o=c[e][0]),c[e][1]>n&&(n=c[e][1])},t.unload=function(){s.removeEventListener("scroll",r)},r=function(){x()},x=function(){var e;if(0<Z[1].getBoundingClientRect().top)G(1);else for(e=1;e<=w;e++){var t=Z[e].getBoundingClientRect(),o=t.top,t=t.bottom-t.top;if(o<=.25*t&&.5*-t<o){G(e);break}}d()},d=function(){i=[A];for(var t,o=s.clientHeight,e=function(e){return 0<(t=Z[e].getBoundingClientRect()).bottom&&t.top<o},n=A-1;1<=n&&e(n);n--)i.push(n);for(n=A+1;n<=w&&e(n);n++)i.push(n)},t.goToPage=function(e,t){var o=0;if(t){var n=t.split(" ");switch(n[0]){case"XYZ":o=Number(n[2]);break;case"FitH":o=Number(n[1]);break;case"FitR":o=Number(n[4]);break;case"FitBH":o=Number(n[1])}0!==(o=isNaN(o)||o<0||o>c[e-1][1]?0:o)&&(o=c[e-1][1]-o)}t=_.getZoom();s.scrollTop=Z[e].offsetTop-I/2+o*t,G(e),d()},t.getVisiblePages=function(){return i},t.updateLayout=function(){},t.isLastPage=function(e){return e===w},t.getZoomBounds=function(){return{width:o,height:n}},t.getAutoZoom=function(e){return t.getZoomBounds().width>s.clientWidth-I?e:1},t.next=function(){F.goToPage(A+1)},t.prev=function(){F.goToPage(A-1)},t.toString=function(){return FormViewer.LAYOUT_CONTINUOUS},t),W=function(e){try{e.getSelection?e.getSelection().empty?e.getSelection().empty():e.getSelection().removeAllRanges&&e.getSelection().removeAllRanges():e.document.selection&&e.document.selection.empty()}catch(t){}},M=(T=!(e={}),e.setup=function(){switch(O){case FormViewer.SELECT_PAN:case FormViewer.SELECT_SELECT:break;default:O=FormViewer.SELECT_SELECT}this.currentSelectMode=O,this.currentSelectMode==F.SELECT_SELECT?e.enableTextSelection():e.enablePanning()},e.enableTextSelection=function(){this.currentSelectMode=F.SELECT_SELECT,U.removeClass(l,"panning"),l.removeEventListener("mousedown",V),document.removeEventListener("mouseup",H),l.removeEventListener("mousemove",k)},V=function(e){return e=e||window.event,U.addClass(l,"mousedown"),g=e.clientX,p=e.clientY,!(T=!0)},H=function(){U.removeClass(l,"mousedown"),T=!1},k=function(e){if(T)return e=e||window.event,s.scrollLeft=s.scrollLeft+g-e.clientX,s.scrollTop=s.scrollTop+p-e.clientY,g=e.clientX,p=e.clientY,!1},e.enablePanning=function(){this.currentSelectMode=F.SELECT_PAN,W(window),U.addClass(l,"panning"),l.addEventListener("mousedown",V),document.addEventListener("mouseup",H),l.addEventListener("mousemove",k)},e.setDefaultMode=function(e){O=e},e),_=(F.setSelectMode=function(e){P?a||(e==F.SELECT_SELECT?M.enableTextSelection():M.enablePanning(),F.fire("selectchange",{type:e})):M.setDefaultMode(e)},v=F.ZOOM_AUTO,E=[.25,.5,.75,1,1.25,1.5,2,2.5,3,3.5,4],L=[F.ZOOM_AUTO,F.ZOOM_FITPAGE,F.ZOOM_FITHEIGHT,F.ZOOM_FITWIDTH,F.ZOOM_ACTUALSIZE],D=0,S=1,C=function(e){var t=u.getZoomBounds(),o=(s.clientWidth-I)/t.width,n=(s.clientHeight-I)/t.height,t=parseFloat(e);switch(isNaN(t)||(S=t,e=F.ZOOM_SPECIFIC),e=e||v){case F.ZOOM_AUTO:S=u.getAutoZoom(o,n);break;case F.ZOOM_FITWIDTH:S=o;break;case F.ZOOM_FITHEIGHT:S=n;break;case F.ZOOM_FITPAGE:S=Math.min(o,n);break;case F.ZOOM_ACTUALSIZE:S=1}return v=e,S},{setup:function(){var e=document.createElement("style");e.setAttribute("type","text/css"),document.head.appendChild(e),h=e.sheet},updateZoom:b=function(e){for(var t=!1,o=!1,e=(4<=(S=C(e))?(S=4,o=!0):S<=.25&&(S=.25,t=!0),s.scrollTop/s.scrollHeight),n=(u.updateLayout(),u.getVisiblePages()),i=1;i<=w;i++)-1===n.indexOf(i)&&Y[i].hide();R&&h.deleteRule(R);var r=function(e,t,o,n){n=n?"translate3d("+e+"px, "+t+"px, 0) scale("+o+")":"translateX("+e+"px) translateY("+t+"px) scale("+o+")";return"-webkit-transform: "+n+";\n-ms-transform: "+n+";\ntransform: "+n+";"}(0,0,S,!1);R=h.insertRule(".page-inner { \n"+r+"\n}",h.cssRules.length);for(var a=0;a<w;a++)Z[a+1].style.width=Math.floor(c[a][0]*S)+"px",Z[a+1].style.height=Math.floor(c[a][1]*S)+"px";s.scrollTop=s.scrollHeight*e,++D%2==1&&b(),F.fire("zoomchange",{zoomType:v,zoomValue:S,isMinZoom:t,isMaxZoom:o})},updateZoomToDefault:function(){b(z)},zoomIn:function(){b(function(){for(var e,t=S,o=E[E.length-1],n=0;n<E.length;n++)if(t<E[n]){o=E[n];break}for(n=0;n<L.length;n++){var i=C(L[n]);t<i&&i<=o&&(e&&i===o||(e=L[n],o=i))}return e||o}())},zoomOut:function(){b(function(){for(var e,t=S,o=E[0],n=E.length-1;0<=n;n--)if(E[n]<t){o=E[n];break}for(n=0;n<L.length;n++){var i=C(L[n]);i<t&&o<=i&&(e&&i===o||(e=L[n],o=i))}return e||o}())},getZoom:function(){return S},setDefault:function(e){z=e}}),N=(F.zoomIn=function(){_.zoomIn()},F.zoomOut=function(){_.zoomOut()},F.setZoom=function(e){P?_.updateZoom(e):_.setDefault(e)},F.goToPage=function(e,t){P?1<=e&&e<=w&&u.goToPage(Number(e),t):A=e},F.next=function(){u.next()},F.prev=function(){u.prev()},F.setLayout=function(e){P?(u.unload(),U.removeClass(s,"layout-"+u.toString()),(u=X).setup(A),U.addClass(s,"layout-"+u.toString()),_.updateZoom(FormViewer.ZOOM_AUTO),u.goToPage(A),F.fire("layoutchange",{layout:e})):f=e},F.updateLayout=function(){_.updateZoom()},function(e){return document.getElementById(e)}),U=(F.on=function(e,t){y[e]||(y[e]=[]),-1===y[e].indexOf(t)&&y[e].push(t)},F.off=function(e,t){y[e]&&-1!==(t=y[e].indexOf(t))&&y[e].splice(t,1)},F.fire=function(e,t){y[e]&&y[e].forEach(function(e){e(t)})},{addClass:function(e,t){var o=0!==e.className.length?e.className.split(" "):[];-1===o.indexOf(t)&&(o.push(t),e.className=o.join(" "))},removeClass:function(){for(var e=arguments[0],t=0!==e.className.length?e.className.split(" "):[],o=1;o<arguments.length;o++){var n=t.indexOf(arguments[o]);-1!==n&&t.splice(n,1)}e.className=t.join(" ")}}),j=(F.handleFormSubmission=function(e,t){FormVuAPI&&((e=e||window.prompt("Please enter the URL to submit to"))?j(e,t):console.log("No URL provided for FormSubmission"))},function(e,t){FormVuAPI&&(e={url:e,success:function(){alert("Form submitted successfully")},failure:function(){alert("Form failed to submit, please try again")}},"json"===("string"==typeof t?t.toLowerCase():"")?"function"==typeof FormVuAPI.submitFormAsJSON&&FormVuAPI.submitFormAsJSON(e):"function"==typeof FormVuAPI.submitFormAsFormData&&FormVuAPI.submitFormAsFormData(e))});"function"==typeof define&&define.amd?define(["formviewer"],[],function(){return F}):"object"==typeof module&&module.exports?module.exports=F:window.FormViewer=F}();

(function() {
"use strict";

/**
 * Shorthand helper function to getElementById
 * @param id
 * @returns {Element}
 */
var d = function (id) {
    return document.getElementById(id);
};

var ClassHelper = (function() {
    return {
        addClass: function(ele, name) {
            var classes = ele.className.length !== 0 ? ele.className.split(" ") : [];
            var index = classes.indexOf(name);
            if (index === -1) {
                classes.push(name);
                ele.className = classes.join(" ");
            }
        },

        removeClass: function(ele, name) {
            var classes = ele.className.length !== 0 ? ele.className.split(" ") : [];
            var index = classes.indexOf(name);
            if (index !== -1) {
                classes.splice(index, 1);
            }
            ele.className = classes.join(" ");
        }
    };
})();

var Button = {};

FormViewer.on('ready', function(data) {
    // Grab buttons
    Button.zoomIn = d('btnZoomIn');
    Button.zoomOut = d('btnZoomOut');

    if (Button.zoomIn) {
        Button.zoomIn.onclick = function(e) { FormViewer.zoomIn(); e.preventDefault(); };
    }
    if (Button.zoomOut) {
        Button.zoomOut.onclick = function(e) { FormViewer.zoomOut(); e.preventDefault(); };
    }

    document.title = data.title ? data.title : data.fileName;
    var pageLabels = data.pageLabels;
    var btnPage = d('btnPage');
    if (btnPage != null) {
        btnPage.innerHTML = pageLabels.length ? pageLabels[data.page - 1] : data.page;
        btnPage.title = data.page + " of " + data.pagecount;

        FormViewer.on('pagechange', function(data) {
            d('btnPage').innerHTML = pageLabels.length ? pageLabels[data.page - 1] : data.page;
            d('btnPage').title = data.page + " of " + data.pagecount;
        });
    }

    if (idrform.app) {
        idrform.app.execFunc = idrform.app.execMenuItem;
        idrform.app.execMenuItem = function (str) {
            switch (str.toUpperCase()) {
                case "FIRSTPAGE":
                    idrform.app.activeDocs[0].pageNum = 0;
                    FormViewer.goToPage(1);
                    break;
                case "LASTPAGE":
                    idrform.app.activeDocs[0].pageNum = FormViewer.config.pagecount - 1;
                    FormViewer.goToPage(FormViewer.config.pagecount);
                    break;
                case "NEXTPAGE":
                    idrform.app.activeDocs[0].pageNum++;
                    FormViewer.next();
                    break;
                case "PREVPAGE":
                    idrform.app.activeDocs[0].pageNum--;
                    FormViewer.prev();
                    break;
                default:
                    idrform.app.execFunc(str);
                    break;
            }
        }
    }

    document.addEventListener('keydown', function (e) {
        if (e.target != null) {
            switch (e.target.constructor) {
                case HTMLInputElement:
                case HTMLTextAreaElement:
                case HTMLVideoElement:
                case HTMLAudioElement:
                case HTMLSelectElement:
                    return;
                default:
                    break;
            }
        }
        switch (e.keyCode) {
            case 33: // Page Up
                FormViewer.prev();
                e.preventDefault();
                break;
            case 34: // Page Down
                FormViewer.next();
                e.preventDefault();
                break;
            case 37: // Left Arrow
                data.isR2L ? FormViewer.next() : FormViewer.prev();
                e.preventDefault();
                break;
            case 39: // Right Arrow
                data.isR2L ? FormViewer.prev() : FormViewer.next();
                e.preventDefault();
                break;
            case 36: // Home
                FormViewer.goToPage(1);
                e.preventDefault();
                break;
            case 35: // End
                FormViewer.goToPage(data.pagecount);
                e.preventDefault();
                break;
        }
    });
});

window.addEventListener("beforeprint", function(event) {
    FormViewer.setZoom(FormViewer.ZOOM_AUTO);
});

})();

//global variables that can be used by ALL the functions on this page.
var is64;
var inputs;
var states = ['On.png', 'Off.png', 'DownOn.png', 'DownOff.png', 'RollOn.png', 'RollOff.png'];
var states64 = ['imageOn', 'imageOff', 'imageDownOn', 'imageDownOff', 'imageRollOn', 'imageRollOff'];

function setImage(input, state) {
    if (inputs[input].getAttribute('images').charAt(state) === '1') {
        document.getElementById(inputs[input].getAttribute('id') + "_img").src = getSrc(input, state);
    }
}

function getSrc(input, state) {
    var src;
    if (is64) {
        src = inputs[input].getAttribute(states64[state]);
    } else {
        src = inputs[input].getAttribute('imageName') + states[state];
    }
    return src;
}

function replaceChecks(isBase64) {

    is64 = isBase64;
    //get all the input fields on the page
    inputs = document.getElementsByTagName('input');

    //cycle trough the input fields
    for(var i=0; i<inputs.length; i++) {
        if(inputs[i].hasAttribute('images'))

        //check if the input is a checkbox
            if(inputs[i].getAttribute('class') !== 'idr-hidden' && inputs[i].getAttribute('data-imageAdded') !== 'true'
                && (inputs[i].getAttribute('type') === 'checkbox' || inputs[i].getAttribute('type') === 'radio')) {

                //create a new image
                var img = document.createElement('img');

                //check if the checkbox is checked
                if(inputs[i].checked) {
                    if(inputs[i].getAttribute('images').charAt(0) === '1')
                        img.src = getSrc(i, 0);
                } else {
                    if(inputs[i].getAttribute('images').charAt(1) === '1')
                        img.src = getSrc(i, 1);
                }

                //set image ID
                img.id = inputs[i].getAttribute('id') + "_img";

                //set action associations
                let imageIndex = i;
                img.addEventListener("click", function(event) {
                    checkClick(imageIndex);
                });
                img.addEventListener("mousedown", function(event) {
                    checkDown(imageIndex);
                });
                img.addEventListener("mouseover", function(event) {
                    checkOver(imageIndex);
                });
                img.addEventListener("mouseup", function(event) {
                    checkRelease(imageIndex);
                });
                img.addEventListener("mouseout", function(event) {
                    checkRelease(imageIndex);
                });

                img.style.position = "absolute";
                var style = window.getComputedStyle(inputs[i]);
                img.style.top = style.top;
                img.style.left = style.left;
                img.style.width = style.width;
                img.style.height = style.height;
                img.style.zIndex = style.zIndex;

                //place image in front of the checkbox
                inputs[i].parentNode.insertBefore(img, inputs[i]);
                inputs[i].setAttribute('data-imageAdded','true');

                //hide the checkbox
                inputs[i].style.display='none';
            }
    }
}

//change the checkbox status and the replacement image
function checkClick(i) {
    if(!inputs[i].hasAttribute('images')) return;
    if(inputs[i].checked) {
        inputs[i].checked = '';
        setImage(i, 1);
    } else {
        inputs[i].checked = 'checked';

        setImage(i, 0);

        if(inputs[i].getAttribute('name') !== null){
            for(var index=0; index<inputs.length; index++) {
                if(index !== i && inputs[index].getAttribute('name') === inputs[i].getAttribute('name')){
                    inputs[index].checked = '';
                    setImage(index, 1);
                }
            }
        }
    }
    inputs[i].dispatchEvent(new Event('click'));
}

function checkRelease(i) {
    if(!inputs[i].hasAttribute('images')) return;
    if(inputs[i].checked) {
        setImage(i, 0);
    } else {
        setImage(i, 1);
    }
    inputs[i].dispatchEvent(new Event('mouseup'));
}

function checkDown(i) {
    if(!inputs[i].hasAttribute('images')) return;
    if(inputs[i].checked) {
        setImage(i, 2);
    } else {
        setImage(i, 3);
    }
    inputs[i].dispatchEvent(new Event('mousedown'));
}

function checkOver(i) {
    if(!inputs[i].hasAttribute('images')) return;
    if(inputs[i].checked) {
        setImage(i, 4);
    } else {
        setImage(i, 5);
    }
    inputs[i].dispatchEvent(new Event('mouseover'));
}

function antiCheat() {
  document.getElementById("form306_1").disabled = true;
  document.getElementById("form307_1").disabled = true;
  document.getElementById("form308_1").disabled = true;
  document.getElementById("form309_1").disabled = true;
  document.getElementById("form310_1").hidden = true;
}