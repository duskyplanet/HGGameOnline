$(function(){
    var lastIndex = 0;
    var $tabs = $(".navigation").find("li");
    var $channels = $(".channel");
    $($channels[0]).show();
    for(var i = 0; i < $tabs.length; i++ ){
        $($tabs[i]).bind('click',i,function(event){
            var clickId = event.data;
            if(lastIndex === clickId) return;
            lastIndex = clickId;
            hideAll($tabs,$channels);
            $($tabs[clickId]).attr('class','active');
            $($channels[clickId]).show();
            //职业全解
            if(clickId===3){
                var $jobsPix = $(".jobs_pix");
                $jobsPix.stop();
                $jobsPix.hide();
                var $jobsIntro = $(".jobs_intro")
                $jobsIntro.stop();
                $jobsIntro.hide();
                var $intros =  $(".intros");
                $intros.stop();
                $intros.hide();
                $(".allJobs").show();
            }
        })
    }
    var $cloud = $(".cloud");
    cloudMove();
    function cloudMove(){
        $cloud.stop();
        $cloud.css("left","800px");
        $cloud.animate({left:'0px'},40000,cloudMove);
    }
    function hideAll(tabs,channels){
        for(var i = 0; i < tabs.length; i++ ){
            $(tabs[i]).attr('class','');
        }
        for(i = 0; i < channels.length; i++ ){
           $(channels[i]).hide();
        }
    }
});
