/* 2018-07-03 HYEJIN */

(function ($) {

    var $window = $(window),
        $body = $('body');

    // BREAKPOINTS
    breakpoints({
        xlarge: ['1281px', '1680px'],
        large: ['981px', '1280px'],
        medium: ['737px', '980px'],
        small: ['481px', '736px'],
        xsmall: [null, '480px']
    });


    // NAV

    // MOBILE TITLEBAR

    $(
            '<div id="titleBar">' +

            // 로고, 메뉴아이콘
            '<a href="#navPanel" class="toggle"></a>' +
            '<h1 class="logo">' + 'imazin.co.kr' +
            '<span class="subtitle"> : 상상</span>' + '</h1>' +
            '</div>'
        )
        .appendTo($body);

    // PANEL

    $(
            '<div id="navPanel">' +

            // 메뉴
            '<nav>' +
            $('#nav').navList() +
            '</nav>' +

            // 로그아웃
            '<div class="alignCenter">' +
            '<button class="brownButton">' +
            '로그아웃' +
            '</button>' +
            '</div>' +

            '</div>'
        )
        .appendTo($body)
        .panel({
            delay: 500,
            hideOnClick: true,
            hideOnSwipe: true,
            resetScroll: true,
            resetForms: true,
            side: 'left',
            target: $body,
            visibleClass: 'navPanel-visible'
        });


    // INDEX MENU
    $window.on('scroll', function () {
        if ($(document).scrollTop() > 50) {
            $('#titleBar').addClass('fixed')
        } else {
            $('#titleBar').removeClass('fixed')
        }
    });

    // TOGGLE 2018-09-11 find('p') 에서, find('div')로 수정
    $('.pushToggle > li:eq(0) span.subject').addClass('active').next().slideDown();

    $('.pushToggle span.subject').click(function (event) {
        var dropDown = $(this).closest('li').find('div');

        $(this).closest('.pushToggle').find('div').not(dropDown).slideUp();

        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
        } else {
            $(this).closest('.pushToggle').find('span.active').removeClass('active');
            $(this).addClass('active');
        }
        dropDown.stop(false, true).slideToggle();
        event.preventDefault();
    });

    // TEXT OVERFLOW
    $('.ellipsis').each(function () {
        var ellipsis = 53;

        $(this).each(function () {
            if ($(this).text().length > ellipsis) {
                $(this).text($(this).text().substr(0, ellipsis) + '...');
            }
        });
    });

    // TABS - 2018-10-10 companyTabs 추가
    $('.faqTabsNav li:first-child, .companyTabsNav li:first-child').addClass('active');
    $('.faqTabContent, .companyTabContent').hide();
    $('.faqTabContent:first, .companyTabContent:first').show();

    $('.faqTabsNav li, .companyTabsNav li').click(function () {
        $('.faqTabsNav li, .companyTabsNav li').removeClass('active');
        $(this).addClass('active');
        $('.faqTabContent, .companyTabContent').hide();

        var activeTab = $(this).find('a').attr('href');
        $(activeTab).show();
        return false;
    });

    //POST DELETE

    $('#btnDelete').on('click', function(e){
        e.preventDefault()
        var $this = $(this)

        var remove = confirm('정말 삭제하시겠습니까?')
        if (remove){
            var image_id = $(this).data('id')
            $.ajax({
                url: '/post/' + image_id,
                type: 'DELETE'
            }).done(function(result){
                console.log(image_id)
                if (result){
                    window.location.href = '/post'
                    alert('삭제되었습니다.')
                } else {
                    alert('오류입니다.')
                }
            })
        }
    })

    //POST MODIFY

    $('#btnModify').on('click', function(e){
        e.preventDefault()
        var $this = $(this)

        var modify = confirm('정말 수정하시겠습니까?')
        if (modify){
            var image_id = $(this).data('id')
            $.ajax({
                url: '/post/' + image_id + '/modify',
                type: 'GET'
            }).done(function(result){
                console.log(image_id)
            })
        }
    })

})(jQuery);

// MODAL
function openModal() {
    $('.modalOpen').click(function () {
        $('.modalWrapper').toggleClass('open');
        $('#pageWrapper').toggleClass('blurOverlay');
        return false;
    });
};
