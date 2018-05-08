/* global jQuery */

jQuery(function ($) {
  'use strict'

  const App = {

    colors: ['Red', 'Blue', 'Green', 'Purple'],
    bX: 25,
    bY: 15,
    points: 0,
    total: 0,

    init: function () {
      for (let i = 0; i < this.bX * this.bY; i++) {
        const pTop = Math.floor(i / this.bX) * 40
        const pLeft = (i % this.bX) * 40
        const color = this.colors[Math.floor(Math.random() * this.colors.length)]
        $('<div class="p"></div>').attr('id', i).css('top', pTop).css('left', pLeft).css('background-color', color).data('color', color).appendTo('#board').click(this.handleTileClick.bind(this))
      }
    },

    handleTileClick: function (event) {
      const el = event.target
      if (this.isMarked(el)) {
        this.deleteMarked()
        this.settleDown()
        this.settleLeft()
        this.updateTotal(this.points)
      } else {
        $('.mark').removeClass('mark')
        let n = this.checkTRBL(el)
        this.points = (n - 1) * (n - 1)
        $('#points').html('' + this.points)
        if (n) {
          this.mark(el)
        } else {
          this.updatePoints(0)
        }
      }
    },

    updatePoints: function (n) {
      this.points = n
      $('#points').html(n)
    },

    updateTotal: function () {
      this.total += this.points
      $('#total').html('' + this.total)
      this.updatePoints(0)
    },

    settleLeft: function () {
      let again = false
      for (let h = 0; h < this.bX - 1; h++) {
        const col = []
        for (let v = 0; v < this.bY; v++) {
          const id = h + (this.bX * v)
          if (document.getElementById(id.toString())) {
            break
          } else {
            col.push(id)
            if (col.length === this.bY) {
              while (col.length > 0) {
                const oid = col.pop()
                if (document.getElementById(oid + 1)) {
                  again = true
                  $('#' + (oid + 1)).attr('id', oid).animate({left: '-=40'}, 10)
                }
              }
            }
          }
        }
      }
      if (again) this.settleLeft()
    },

    settleDown: function () {
      let again = false
      for (let i = this.bX * this.bY - 1; i > -1; i--) {
        if (!document.getElementById(i.toString())) {
          if (document.getElementById((i - this.bX).toString())) {
            $('#' + (i - this.bX)).attr('id', i).animate({top: '+=40'}, 10)
            again = true
          }
        }
      }
      if (again) this.settleDown()
    },

    deleteMarked: function () {
      $('.mark').remove()
    },

    mark: function (el) {
      $(el).addClass('mark')
    },

    checkTRBL: function (el) {
      let c = 0
      const t = parseInt(el.id) - this.bX
      const r = parseInt(el.id) + 1
      const b = parseInt(el.id) + this.bX
      const l = parseInt(el.id) - 1
      if (t > -1 && this.same(el, t) && !this.isMarked(document.getElementById(t.toString()))) {
        c++
        this.mark(document.getElementById(t.toString()))
        c += this.checkTRBL(document.getElementById(t.toString()))
      }
      if (r % this.bX !== 0 && this.same(el, r) && !this.isMarked(document.getElementById(r.toString()))) {
        c++
        this.mark(document.getElementById(r.toString()))
        c += this.checkTRBL(document.getElementById(r.toString()))
      }
      if (b < this.bX * this.bY && this.same(el, b) && !this.isMarked(document.getElementById(b.toString()))) {
        c++
        this.mark(document.getElementById(b.toString()))
        c += this.checkTRBL(document.getElementById(b.toString()))
      }
      if ((l + 1) % this.bX !== 0 && this.same(el, l) && !this.isMarked(document.getElementById(l.toString()))) {
        c++
        this.mark(document.getElementById(l.toString()))
        c += this.checkTRBL(document.getElementById(l.toString()))
      }
      return c
    },

    same: function (el, nb) {
      return $(el).data('color') === $('#' + nb).data('color')
    },

    isMarked: function (el) {
      return $(el).hasClass('mark')
    }
  }

  App.init()
})
