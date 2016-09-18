var log = function() {
  console.log(arguments)
}

// 这个函数用来根据 weibo 对象生成一条微博的 HTML 代码
var weiboTemplate = function(weibo) {
  var w = weibo
  var t = `
    <div class="weibo-cell cell item" data-id="${ w.id }">
      <img src="${ w.avatar }" class="avatar">
      <div class="push-by-message">
          <span class="right span-margin weibo-user">${ w.name }</span> 发表于
          <span class="right span-margin">${ w.created_time }</span>
      </div>
      <span class="weibo-content">${ w.weibo }</span>
      <div class="right span-margin weibo-cell-menu">
        <button class="weibo-edit btn-xs btn-primary" data-id="${ w.id }">编辑</button>
        <button class="weibo-delete btn-xs btn-danger" data-id="${ w.id }">删除</button>
        <a href="#" class="weibo-comment label label-primary">评论(<span class="comments-num">${ w.comments_num }</span>)</a>
      </div>
      <div class="weibo-update-form duan-hide">
          <input class="weibo-update-content" type="text" value="">
          <button class="weibo-update btn-sm btn-default">更新</button>
      </div>
      <div class="duan-comment-div duan-hide">
          <div class="comment-add-div">
              <img src="${ w.avatar }" class="avatar">
              <input class="comment-id" type="hidden" name="weibo_id" value="${ w.id }">
              <input class="comment-content left m" name="comment"  placeholder="Comment">
              <button class="comment-add btn-sm btn-default">发表</button>
          </div>
          <div class="box comment-container">
          </div>
      </div>
    </div>
  `
  return t
}

var commentTemplate = function(comment) {
  var c = comment
  var t = `
      <div class="cell-inner item">
          <img src="${ c.avatar }" class="avatar-s">
          <div class="comment-div">
              <span class="name right span-margin">${ c.name }:</span>
              <span class="comment">${ c.comment }</span>
          <div>
          <span class="time right span-margin">${ c.created_time }</span>
      </div>
  `
  return t
}

var bindEventCommentToggle = function(){
    // 展开评论事件
    // $('a.com').on('click', function(){
    $('.weibo-container').on('click', '.weibo-comment', function(){
        // $(this).parent().next().slideToggle()
        $(this).closest('.weibo-cell').find('.weibo-update-form').slideUp()
        $(this).closest('.weibo-cell').find('.duan-comment-div').slideToggle()
        // 因为展开评论是一个超链接 a 标签
        // 所以需要 return false 来阻止它的默认行为
        // a 的默认行为是跳转链接，没有指定 href 的时候就跳转到当前页面
        // 所以需要阻止
        return false;
    })
}

var bindEventCommentAdd = function() {
    // 给按钮绑定添加 weibo 事件
    $('.weibo-container').on('click', '.comment-add', function(){
      // 得到微博的内容并且生成 form 数据
        var weibo_id = $(this).parent().find('.comment-id').val()
        var weibo_cell = $(this).closest('.weibo-cell')
        var comment = $(this).parent().find('.comment-content').val()
        var comment_container = $(this).parent().parent().find('.comment-container')
        log('comment,', comment)
        var form = {
            weibo_id: weibo_id,
            comment: comment,
        }

      // 这个响应函数会在 AJAX 调用完成后被调用
      var response = function(r) {
          /*
          这个函数会被 weiboAdd 调用，并且传一个 r 参数进来
          r 参数的结构如下
          {
              'success': 布尔值,
              'data': 数据,
              'message': 错误消息
          }
          */
          // arguments 是包含所有参数的一个 list
          console.log('成功', arguments)
          log(r)
          if(r.success) {
              // 如果成功就添加到页面中
              // 因为添加微博会返回已添加的微博数据所以直接用 r.data 得到
              var c = r.data
              $(comment_container).append(commentTemplate(c))
              var n = parseInt($(weibo_cell).find('.comments-num').text()) + 1
              $(weibo_cell).find('.comments-num').text(n.toString())

            //   var n = parseInt($(comment_container).parent().find('.comments-num').text()) + 1
            //   $(comment_container).parent().find('.comments-num').text(n.toString())
            //    $(comment_container).parent().prev().find('.comments-num').text((parseInt(n) + 1).toFormatString())
            //   $('.comment-container').append(commentTemplate(c))
              alert("添加成功")
              log('添加成功')
              log('n', n)
              log('comment,', comment)
          } else {
              // 失败，弹出提示
              alert(r.message)
          }
      }

      // 把上面的 form 和 response 函数传给 weiboAdd
      // api 在 api.js 中，因为页面会先引用 api.js 再引用 weibo.js
      // 所以 weibo.js 里面可以使用 api.js 中的内容
      api.commentAdd(form, response)
    })
}

var bindEventWeiboAdd = function() {
    // 给按钮绑定添加 weibo 事件
    $('#id-button-weibo-add').on('click', function(){
      // 得到微博的内容并且生成 form 数据
      var weibo = $('#id-input-weibo').val()
      log('weibo,', weibo)
      var form = {
        weibo: weibo,
      }

      // 这个响应函数会在 AJAX 调用完成后被调用
      var response = function(r) {
          /*
          这个函数会被 weiboAdd 调用，并且传一个 r 参数进来
          r 参数的结构如下
          {
              'success': 布尔值,
              'data': 数据,
              'message': 错误消息
          }
          */
          // arguments 是包含所有参数的一个 list
          console.log('成功', arguments)
          log(r)
          if(r.success) {
              // 如果成功就添加到页面中
              // 因为添加微博会返回已添加的微博数据所以直接用 r.data 得到
              var w = r.data
              $('.weibo-container').prepend(weiboTemplate(w))
              alert("添加成功")
          } else {
              // 失败，弹出提示
              alert(r.message)
          }
      }

      // 把上面的 form 和 response 函数传给 weiboAdd
      // api 在 api.js 中，因为页面会先引用 api.js 再引用 weibo.js
      // 所以 weibo.js 里面可以使用 api.js 中的内容
      api.weiboAdd(form, response)
    })
}

var bindEventWeiboEdit = function() {
    $('.weibo-container').on('click', '.weibo-edit', function(){
        var button = $(this)
        var div = button.closest('.weibo-cell')
        var weibo_content = button.closest('.weibo-cell').find('.weibo-content').text()
        log('weibo_content', weibo_content)
        div.find('.duan-comment-div').slideUp()
        div.find('.weibo-update-form').slideToggle()
        button.closest('.weibo-cell').find('.weibo-update-content').val(weibo_content)
    })

    $('.weibo-container').on('click', '.weibo-update', function(){
        var button = $(this)
        button.parent().slideUp()
        var weiboId = button.closest('.weibo-cell').data('id')
        var weibo = button.parent().find('.weibo-update-content').val()
        log(weiboId)
        log(weibo)
        var form = {
            weibo_id: weiboId,
            weibo: weibo,
        }

        // 这个响应函数会在 AJAX 调用完成后被调用
        var response = function(r) {
            /*
            这个函数会被 weiboAdd 调用，并且传一个 r 参数进来
            r 参数的结构如下
            {
                'success': 布尔值,
                'data': 数据,
                'message': 错误消息
            }
            */
            // arguments 是包含所有参数的一个 list
            console.log('成功', arguments)
            log(r)
            if(r.success) {
                // 如果成功就添加到页面中
                // 因为添加微博会返回已添加的微博数据所以直接用 r.data 得到
                var c = r.data
                log('c', c.weibo)
                $(button).closest('.weibo-cell').find('.weibo-content').text(c.weibo)
                alert("编辑成功")
            } else {
                // 失败，弹出提示
                alert(r.message)
            }
        }

        // 把上面的 form 和 response 函数传给 weiboAdd
        // api 在 api.js 中，因为页面会先引用 api.js 再引用 weibo.js
        // 所以 weibo.js 里面可以使用 api.js 中的内容
        api.weiboUpdate(form, response)
    })
}

var bindEventWeiboDelete = function() {
    // 绑定删除微博按钮事件
    $('.weibo-container').on('click', '.weibo-delete', function(){
      // 得到当前的 weibo_id
      var weiboId = $(this).data('id')
      log(weiboId)
      // 得到整个微博条目的标签
      var weiboCell = $(this).closest('.weibo-cell')
      var weiboUser = $(weiboCell).find('.weibo-user').text()
      log('weiboUser', weiboUser)
      var form = {
          weiboId: weiboId,
          weiboUser: weiboUser,
      }

      // 调用 api.weiboDelete 函数来删除微博并且在删除成功后删掉页面上的元素
    //   api.weiboDelete(weiboId, function(response) {
      var response = function(r) {
          // 直接用一个匿名函数当回调函数传给 weiboDelete
          // 这是 js 常用的方式
          console.log('成功', arguments)
          log(r)
          if(r.success) {
              // 如果成功就添加到页面中
              // 因为添加微博会返回已添加的微博数据所以直接用 r.data 得到
              console.log('成功', arguments)
              $(weiboCell).slideUp()
              alert("删除成功")
          } else {
              // 失败，弹出提示
              console.log('错误', arguments)
              alert(r.message)
          }
      }

      api.weiboDelete(form, response)
    })
}

var bindEvents = function() {
    // 不同的事件用不同的函数去绑定处理
    // 这样逻辑就非常清晰了
    bindEventCommentToggle()
    bindEventCommentAdd()
    bindEventWeiboAdd()
    bindEventWeiboEdit()
    bindEventWeiboDelete()
}

// 页面载入完成后会调用这个函数，所以可以当做入口
$(document).ready(function(){
    // 用 bindEvents 函数给不同的功能绑定事件处理
    // 这样逻辑就非常清晰了
    bindEvents()
})
