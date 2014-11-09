$(function(){
    var self = this;
    self.elements = {
        $jobSlider : $(".jobs_slider"),
        $jobSliderInner : $("#jobs_inner"),
        $jobSliderToLeft : $(".to_left"),
        $jobSliderToRight : $(".to_right"),
        $jobsTitle:$(".title"),
        $jobsBorder:$(".border"),
        $jobsPix:$(".jobs_pix"),
        $jobsIntro:$(".jobs_intro"),
        $intros:$(".intros"),
        $allJobs:$(".allJobs"),
        pageNum : 1,
        pageTotal :9,
        lastSelectTitleId : -1,
        charTimer:null,
        timers:{
            pixFadeIn:4000,
            charsFadeIn:2000
        },
        intros:{
            jobTitle:$(".jobTitle"),
            jobRule:$("#jobRule"),
            basicIcon:$("#basicSkillIcon"),
            basicIntro:$("#basicSkillIntro"),
            fstIcon:$("#firstSkillIcon"),
            fstIntro:$("#firstSkillIntro"),
            sndIcon:$("#secondSkillIcon"),
            sndIntro:$("#secondSkillIntro"),
            forbidden:$("#jobForbidden"),
            enlightenIcon:$("#lightSkillIcon"),
            enlightenIntro:$("#lightSkillIntro")
        }
    };
    self.initEvents = function(){
        self.elements.$jobSliderToLeft.hide();
        self.elements.$jobSlider.mouseenter(function(){
            self.elements.$jobSliderToLeft.stop();
            self.elements.$jobSliderToRight.stop();
            self.elements.$jobSliderToLeft.animate({"left":"0px"},200);
            self.elements.$jobSliderToRight.animate({"left":"952px"},200);
        });
        self.elements.$jobSlider.mouseleave(function(){
            self.elements.$jobSliderToLeft.stop();
            self.elements.$jobSliderToRight.stop();
            self.elements.$jobSliderToLeft.animate({"left":"-28px"},200);
            self.elements.$jobSliderToRight.animate({"left":"980px"},200);
        });
        self.elements.$jobSliderToRight.click(function(){
            if(self.elements.pageNum+1 >= self.elements.pageTotal){
                self.elements.$jobSliderToRight.hide();
            }
            self.elements.$jobSliderToLeft.show();
            self.elements.pageNum++;
            self.elements.$jobSliderInner.animate({"left":"-=327px"},300);
        });
        self.elements.$jobSliderToLeft.click(function(){
            if(self.elements.pageNum-1 <= 1){
                self.elements.$jobSliderToLeft.hide();
            }
            self.elements.$jobSliderToRight.show();
            self.elements.pageNum--;
            self.elements.$jobSliderInner.animate({"left":"+=327px"},300);
        });
        for(var i = 0; i < self.elements.$jobsTitle.length; i++){
            $(self.elements.$jobsTitle[i]).bind('click',i,function(event){
              // $(event.target).parent.append("<span class='highlight'></span>");
                if(event.data === self.elements.lastSelectTitleId) return;
                if( self.elements.lastSelectTitleId!=-1){
                    var $lastTitle = $(".title").eq(self.elements.lastSelectTitleId);
                    var $lastSpan = $($lastTitle).parent();
                    //$($lastSpan).css("border","solid 1px #8844ff");
                    $($lastSpan).find(".highlight").remove();
                    $(self.elements.$jobsBorder[self.elements.lastSelectTitleId]).attr('class','border');
                }
                $(self.elements.$jobsBorder[event.data]).attr('class','border back');
                var $span = $(event.target).parent();
                //$($span).css("border","solid 1px #220044");
                $($span).append("<span class='highlight'></span>");
                self.elements.lastSelectTitleId = event.data;
                self.elements.$allJobs.hide();
                self.elements.$intros.show();
                self.effects.showJobsById(event.data);
            });
        }
        for(i = 0; i < self.elements.$jobsBorder.length; i++){
            $(self.elements.$jobsBorder[i]).bind('mouseenter',i,function(event){
                if(event.data===self.elements.lastSelectTitleId) return;
                $(self.elements.$jobsBorder[event.data]).attr('class','border active');
                toggleHinter(self.elements.$jobsBorder[event.data],"show");
            });
            $(self.elements.$jobsBorder[i]).bind('mouseleave',i,function(event){
                toggleHinter(self.elements.$jobsBorder[event.data],"hide");
                if(event.data===self.elements.lastSelectTitleId) return;
                $(self.elements.$jobsBorder[event.data]).attr('class','border');
            });
        }
        function toggleHinter($obj,type){
            var $hinter = $($obj).find(".hinter");
            if(type==="show"){
                $($hinter).css("opacity","1");
            }else{
                $($hinter).css("opacity","0");
            }
        }
        self.elements.intros.basicIcon.html(getBasicSkillIcon());
        self.elements.intros.basicIntro.html(getBasicSkillInfo());
    };
    self.effects ={
        showJobsById :function(jobId){

            var contentDivs = this.loadContents(jobId);
            self.elements.$jobsPix.stop();
            self.elements.$jobsIntro.stop();
            var intro = self.elements.intros;
            intro.jobTitle.stop();
            intro.jobRule.stop();
            intro.basicIcon.stop();
            intro.basicIntro.stop();
            intro.fstIcon.stop();
            intro.fstIntro.stop();
            intro.sndIcon.stop();
            intro.sndIntro.stop();
            intro.forbidden.stop();
            intro.enlightenIcon.stop();
            intro.enlightenIntro.stop();
            this.hideAll();
            $(self.elements.$jobsPix).fadeIn(self.elements.timers.pixFadeIn);
            if(self.elements.charTimer!=null){
                clearTimeout(self.elements.charTimer);
            }
            self.elements.charTimer = setTimeout(function(){
                $(self.elements.$jobsIntro).toggle(self.elements.timers.charsFadeIn);
            },2000);
            if(contentDivs.length>0){
                showNext(0);
            }
            function showNext(next){
                var thisDiv = contentDivs[next];
                thisDiv.animate({"left":"0px"},200,function(){
                    if((next+1) < contentDivs.length){
                        showNext((next+1));
                    }
                });
            }
        },
        hideAll :function(){
            self.elements.$jobsPix.hide();
            self.elements.$jobsIntro.hide();
            var intro = self.elements.intros;
            intro.jobTitle.css("left","475px");
            intro.jobRule.css("left","475px");
            intro.basicIcon.css("left","475px");
            intro.basicIntro.css("left","475px");
            intro.fstIcon.css("left","475px");
            intro.fstIntro.css("left","475px");
            intro.sndIcon.css("left","475px");
            intro.sndIntro.css("left","475px");
            intro.forbidden.css("left","475px");
            intro.enlightenIcon.css("left","475px");
            intro.enlightenIntro.css("left","475px");
        },
        loadContents :function(jobId){
            $(self.elements.$jobsPix).html("<img class='jobPic' src='./images/jobs/jobPic_"+(jobId+1)+".jpg'/>");
            $(self.elements.$jobsIntro).html(getJobIntro(jobId));
            var intro = self.elements.intros;
            var contentAniArray = [];
            var jobAttr = getJobContentById(jobId);
            loadContentHtml(jobAttr);
            decideAni(jobAttr);
            function decideAni(jobAttr){
                contentAniArray.push(intro.jobTitle);
                for(var i = 0; i < jobAttr.length;i++){
                    switch (jobAttr[i]){
                        case "basic":{
                            contentAniArray.push(intro.basicIcon);
                        } break;
                        case "first":{
                            contentAniArray.push(intro.fstIcon);
                        } break;
                        case "second":{
                            contentAniArray.push(intro.sndIcon);
                        } break;
                        case "enlighten":{
                            contentAniArray.push(intro.enlightenIcon);
                        }
                    }
                }
                for(i = 0 ;i <jobAttr.length;i++){
                    switch (jobAttr[i]){
                        case "rule":{
                            contentAniArray.push(intro.jobRule);
                        } break;
                        case "basic":{
                            contentAniArray.push(intro.basicIntro);
                        } break;
                        case "first":{
                            contentAniArray.push(intro.fstIntro);
                        } break;
                        case "second":{
                            contentAniArray.push(intro.sndIntro);
                        } break;
                        case "forbidden":{
                            contentAniArray.push(intro.forbidden)
                        } break;
                        case "enlighten":{
                            contentAniArray.push(intro.enlightenIntro);
                        }
                    }
                }
            }
            function loadContentHtml(jobAttr){
                var intro = self.elements.intros;
                intro.jobRule.hide();
                intro.basicIcon.hide();
                intro.basicIntro.hide();
                intro.fstIcon.hide();
                intro.fstIntro.hide();
                intro.sndIcon.hide();
                intro.sndIntro.hide();
                intro.forbidden.hide();
                intro.enlightenIcon.hide();
                intro.enlightenIntro.hide();
                intro.jobTitle.attr("class","jobTitle "+JOBS_INFO.ABBR[jobId+1]);
                for(var i = 0; i < jobAttr.length;i++){
                    switch (jobAttr[i]){
                        case "rule":{
                            intro.jobRule.html(getJobRulesById(jobId));
                            intro.jobRule.show();
                        } break;
                        case "basic":{
                            intro.basicIcon.show();
                            intro.basicIntro.show();
                        } break;
                        case "first":{
                            intro.fstIcon.html(getFirstSkillIconById(jobId));
                            intro.fstIcon.show();
                            intro.fstIntro.html(getFirstSkillInfoById(jobId));
                            intro.fstIntro.show();
                        } break;
                        case "second":{
                            intro.sndIcon.html(getSecondSkillIconById(jobId));
                            intro.sndIcon.show();
                            intro.sndIntro.html(getSecondSkillInfoById(jobId));
                            intro.sndIntro.show();
                        } break;
                        case "forbidden":{
                            intro.forbidden.html(getJobForbiddenById(jobId));
                            intro.forbidden.show();
                        } break;
                        case "enlighten":{
                            intro.enlightenIcon.html(getEnlightenSkillIconById(jobId));
                            intro.enlightenIcon.show();
                            intro.enlightenIntro.html(getEnlightenSkillInfoById(jobId));
                            intro.enlightenIntro.show();
                        }
                    }
                }
            }
            return contentAniArray;
        }
    };
    self.initEvents();
});