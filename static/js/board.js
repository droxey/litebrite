"use strict";

function initPusher() {
  var isDevelopment = document.location.href.indexOf("localhost") === -1;
  Pusher.logToConsole = isDevelopment;

  var pusher = new Pusher('695a533e6765f3bbf870', {
    cluster: 'us3',
    forceTLS: !isDevelopment
  });

  var channel = pusher.subscribe('litebrite');
  channel.bind('led-on', function (data) {
    const ledClass = `row-${data.row} col-${data.column}`;
    const led = document.getElementsByClassName(ledClass)[0];
    if (led !== undefined) {
      led.setAttribute("fill", data.color);
      led.classList.add("selected");

      if (data.name !== "" && data.color !== "") {
        const updates = document.getElementById('updates');
        const update = document.createElement('p');
        update.innerHTML =
          `<b>${data.name}</b> set <b>${data.row}, ${data.column}</b> to <b>${data.color}</b>!`;
        updates.prepend(update);
      }
    }
  });
}

function drawBoard() {
  const ledSize = 24;
  const w = window.innerWidth - (ledSize * 4);
  const h = window.innerHeight - (ledSize * 4);

  // create the svg
  let svg = d3.select('#grid').append('svg')
    .attr('width', '789px')
    .attr('height', '790px');

  svg.append("defs").append("radialGradient")
    .attr("id", "ledOff")
    .attr("cx", "50%") //not really needed, since 50% is the default
    .attr("cy", "50%") //not really needed, since 50% is the default
    .attr("r", "45%") //not really needed, since 50% is the default
    .selectAll("stop")
    .data([{
        offset: "0%",
        color: "white"
      },
      {
        offset: "60%",
        color: "rgba(250, 250, 250, 0.85)"
      },
      {
        offset: "90%",
        color: "rgba(245, 245, 245, 0.8)"
      },
      {
        offset: "100%",
        color: "rgba(255,255,255, 0.9)"
      }
    ])
    .enter().append("stop")
    .attr("offset", function (d) {
      return d.offset;
    })
    .attr("stop-color", function (d) {
      return d.color;
    });

  // calculate number of rows and columns
  const squaresRow = 33; //_.round(w / ledSize * 2);
  const squaresColumn = 33; //_.round(h / ledSize * 2);

  // loop over number of columns
  _.times(squaresColumn, function (n) {
    // create each set of rows
    svg.selectAll(`rect .row-${n + 1}`)
      .data(d3.range(squaresRow)).enter().append('rect')
      .attr({
        class: function (d, i) {
          return `square row-${n+1} col-${i+1}`;
        },
        id: function (d, i) {
          return `s-${(n + 1) + (i + 1)}`;
        },
        x: function (d, i) {
          return (i * ledSize) + 1;
        },
        width: ledSize,
        height: ledSize,
        y: (n * ledSize) + 2,
        rx: ledSize / 2,
        fill: "url(#ledOff)"
      });
    });
}


initPusher();
drawBoard();
