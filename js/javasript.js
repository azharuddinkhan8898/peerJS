$(function () {
  //var peer = new Peer({key: 'lwjd5qra8257b9'});
  var conn;
  var connectID;
  var randomID;
  var peer;
  var checkepmty;
  var ref = firebase.database().ref('users/');
  $("#signup").click(function (e) {
    var userName = $(".nameup").val().split(' ').join('-');
    var userPass = $(".passup").val();
    var userId = $(".idup").val();
    if (userName && userPass && userId) {
      ref.orderByChild("ID").equalTo(userId).on("child_added", function (data) { checkepmty = data.val() });
      if (checkepmty) {
        $(".idNotEx").removeClass("hide");
      } else {
        $(".idNotEx").addClass("hide");
        ref.push({
          name: userName,
          pass: userPass,
          ID: userId
        });
        console.log("push");
        $(".signIn").append("<p>Account created with ID " + userId);
      }


    } else {
      e.preventDefault();
    }

  });
  $("#signin").click(function () {
    var inID = $(".idin").val();
    var inPass = $(".passin").val();
    ref.orderByChild("ID").equalTo(inID).on("child_added", function (data) {
      if (inID == data.val().ID) {
        if (inPass === data.val().pass) {
          console.log("logged in");
          randomID = inID;
          $(".signIn").hide();
          $(".chatPage").show();
          console.log("logged in as " + data.val().name);
          peer = new Peer(randomID, {
            host: '140.10.2.14',
            port: 9000,
            path: '/'
          });
          peer.on('open', function (id) {
            console.log('My peer ID is: ' + id);
            ref.orderByChild("name").on("child_added", function (data) {
              $(".div1 ul").append("<li data-name=" + data.val().ID + ">" + data.val().name.split("-").join(" ") + "</li>");
            });
            $(".div1 ul li").click(function () {
              console.log("clicked");
              connectID = $(this).attr("data-name");
              console.log(connectID);
              conn = peer.connect(connectID);
              conn.on('open', function () {
                $(".msgsend").click(function () {
                  var msg = $(".msg").val();
                  conn.send(msg);
                  $(".msg").val("");
                  $(".msgsBox").append("<p>you: " + msg);
                });
              });
            });
            // $(".submitC").click(function () {
            //   $(".idNotEx").addClass("hide");
            //   connectID = $(".idc").val();
            //   conn = peer.connect(connectID);
            //   conn.on('open', function () {
            //     $(".msgsend").click(function () {
            //       var msg = $(".msg").val();
            //       conn.send(msg);
            //       $(".msg").val("");
            //       $(".msgsBox").append("<p>you: " + msg);
            //     });
            //     // conn.on('data', function(data) {
            //     //   console.log("aa");
            //     //   console.log('Received', data);
            //     // });
            //   });
            // });
          });
          peer.on('connection', function (conn) {
            // if (conn.peer != connectID) {
            //   var wantToConnect = confirm(conn.peer + " is wanted to connect with you");
            //   if (wantToConnect == true) {
            //     conn = peer.connect(conn.peer);
            //     console.log(conn.peer + " is connected with you");
            //     conn.on('data', function(data) {
            //       console.log('Received', data);
            //     });
            //   } else {
            //     console.log("reject");
            //   }
            // }
            console.log(conn.peer + " is connected with you");
            conn.on('data', function (data) {
              console.log('Received', data);
              $(".msgsBox").append("<p>" + conn.peer + " : " + data);
            });
          });
          peer.on('error', function (err) {
            console.log(err);
            if (err.type == 'unavailable-id') {
              $(".idEx").removeClass("hide");
            } else if (err.type == 'peer-unavailable') {
              $(".idNotEx").removeClass("hide");
            }
          })
        } else {
          $(".idEx").removeClass("hide");
        }
      } else {
        $(".idEx").removeClass("hide");
      }
    });
  });




  $(".msg").keypress(function (e) {
    var key = e.which;
    if (key == 13) {
      $(".msgsend").click();
      return false;
    }
  });
});
