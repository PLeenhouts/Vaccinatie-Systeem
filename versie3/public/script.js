    function loadVisitors() {
      const visitors = JSON.parse(localStorage.getItem("visitors")) || [];
      const listEl = document.getElementById("visitorList");
      listEl.innerHTML = "";
      visitors.forEach(visitor => {
        const li = document.createElement("li");
        li.innerText = visitor;
        listEl.appendChild(li);
      });
    }

    function sendName() {
      const name = document.getElementById("nameInput").value.trim();
      if (name === "") return;

      fetch(`/welcome?name=${encodeURIComponent(name)}`)
        .then(response => response.json())
        .then(data => {
          document.getElementById("greeting").innerText = data.message;
         
          let visitors = JSON.parse(localStorage.getItem("visitors")) || [];
          if (!visitors.includes(name)) {
            visitors.push(name);
            localStorage.setItem("visitors", JSON.stringify(visitors));
          }

          loadVisitors();
        });
    }

    loadVisitors();
