$(() => {

    var numbers = 50, numbersPlusTime = 1000

    var blocks = document.getElementsByClassName('blocks'), lastElm, 
        abilsElm = document.getElementsByClassName('abilElm'),
        shu = document.getElementsByClassName('shuElm')

    var Aname = document.getElementsByClassName('abilName'),
        Adesc = document.getElementsByClassName('abilDescription'),
        Aprice = document.getElementsByClassName('abilPrice'),
        Astatus = document.getElementsByClassName('abilStatus'),
        Abuy = document.getElementsByClassName('abilBuy')

    var SHUname = document.getElementsByClassName('shuName'),
        SHUdesc = document.getElementsByClassName('shuDescription'),
        SHUprice = document.getElementsByClassName('shuPrice'),
        SHUstatus = document.getElementsByClassName('shuStatus'),
        SHUbuy1 = document.getElementsByClassName('shuBuy1'),
        SHUbuy10 = document.getElementsByClassName('shuBuy10'),
        SHUbuy100 = document.getElementsByClassName('shuBuy100'),
        SHUbuyMAX = document.getElementsByClassName('shuBuyMax')

    var shopAbilities = [
        {
            name: 'Волшебный квадрат',
            desctiprion: 'Купив данный квадрат, вы сможете получть деньги за клики!',
            price: 50,
            _status: 0,
            event: function() {
                $('#click-block').css({display: 'grid'})
            }
        }
    ]

    var shopClicksUpgrades = [
        {
            special: false,
            name: 'Помощник-математик',
            desctiprion: '+0.01 за клик',
            price: 60,
            lvl: 0,
            formula: function(val, props) {
                return val + (30 + props.lvl)
            },
            event: function(val) {
                clickData.plus += val * 0.015
            }
        },
        {
            special: false,
            name: 'Рюмка удачи',
            desctiprion: 'С каждым уровнем повышает шанс получить 3x циферок за клик',
            price: 200,
            lvl: 0,
            formula: function(val, props) {
                return val * (1.25 + props.lvl)
            },
            event: function(val) {
                clickData.doubleChance += val * 0.01
            },
            max: 100
        }
    ]

    var clickData = {
        plus: 0.02,
        doubleChance: 0
    }

    var casino = {
        max: 5,
        setted: -1
    }

    $(blocks[0]).css({margin: '0'})

    function numbersPlus() {

        setTimeout(() => {

            numbers++
            updateData(0)
            numbersPlus()

        }, numbersPlusTime)

    }

    function fadeBlock(elm, prop) {

        if (prop === 0) {

            for (var i = 0; i < blocks.length; i++) $(blocks[i]).css({
                margin: '0 -100vw 0 0',
                transition: '.5s'
            })

            setTimeout(() => {

                elm.css({
                    margin: '0',
                    transition: '.4s'
                })

            }, 500)

        } else {

            elm.css({
                margin: '0 -100vw 0 0',
                transition: '.5s'
            })

            setTimeout(() => {

                $('#main').css({
                    margin: '0',
                    transition: '.4s'
                })

            }, 500)

        }

    }

    function updateData(type) {

        if (type === 0) $('#numbers-count').text(numbers.toFixed(3))
        
        if (type === 1) for (var i = 0; i < abilsElm.length; i++) {

            $(Aname[i]).text(shopAbilities[i].name)
            $(Adesc[i]).text(shopAbilities[i].desctiprion)
            $(Aprice[i]).text(shopAbilities[i].price + 'циферок')
            $(Astatus[i]).text(shopAbilities[i]._status === 0 ? 'Продается' : 'Куплен')

            if (shopAbilities[i]._status === 0) $(Abuy).attr('value', i)
            else $(Abuy).fadeOut(0)

        }

        if (type == 2) for (var i = 0; i < shu.length; i++) {

            $(SHUname[i]).text(shopClicksUpgrades[i].name)
            $(SHUdesc[i]).text(shopClicksUpgrades[i].desctiprion)
            $(SHUprice[i]).text(shopClicksUpgrades[i].price.toFixed(2) + 'циферок')
            $(SHUstatus[i]).text(shopClicksUpgrades[i].lvl + 'уровень')
            $(SHUbuy1[i]).attr('num', i)
            $(SHUbuy10[i]).attr('num', i)
            $(SHUbuy100[i]).attr('num', i)
            $(SHUbuyMAX[i]).attr('num', i)

        }

        if (type == 3) {

            $('#casino-black').css({border: '2px solid white'})
            $('#casino-red').css({border: '2px solid white'})

            if (casino.setted === 0) $('#casino-black').css({border: '2px solid green'})
            if (casino.setted === 1) $('#casino-red').css({border: '2px solid green'})

        }

    }

    $('body').on('click', 'p.abilBuy', function() {

        var value = $(this).attr('value')
        if (shopAbilities[value].price > numbers) alert('Недостаточно циферок!')
        else {

            shopAbilities[value]._status = 1; numbers -= shopAbilities[value].price
            shopAbilities[value].event()
            updateData(1)

        }

        updateData(0)

    })

    $('body').on('click', 'a.shuBuyBtn', function() {

        var value = $(this).attr('value'), num = $(this).attr('num'), 
            formula = shopClicksUpgrades[num].formula

        if (value != 'max') {

            if (shopClicksUpgrades[num].lvl + +value > shopClicksUpgrades[num].max) {

                alert('Вы хотите превысить максимальный уровень')
                return false

            }

            var price = shopClicksUpgrades[num].price, sumPrice = price
            for (var i = 1; i < +value; i++) {
                price = formula(price, {lvl: i})
                sumPrice += price
            }
            price = formula(price, {lvl: i})
            if (sumPrice > numbers) alert(`Тебе не хватает ${sumPrice - numbers} циферок`)
                else {
                    
                    numbers -= sumPrice; shopClicksUpgrades[num].lvl += +value
                    shopClicksUpgrades[num].price = price
                    shopClicksUpgrades[num].event(+value)

                }
        }

        updateData(2)
        updateData(0)

    })

    $('#shopAbilities-click').click(() => {
        
        lastElm = $('#shopAbilities')
        fadeBlock(lastElm, 0)

    })

    $('#click-block-upgrade').click(() => {
        
        lastElm = $('#shopClicksUpgrades')
        fadeBlock(lastElm, 0)

    })

    $('.back button').click(() => {

        fadeBlock(lastElm, 1)

    })

    $('#casino-click').click(() => {

        lastElm = $('#casino')
        fadeBlock(lastElm, 0)

    })

    $('#click-block').click(() => {

        var chance = Math.random(), plus = clickData.plus
        if (chance < clickData.doubleChance) plus *= 3
        numbers += plus
        updateData(0)

    })

    $('#casino-black').click(() => {
        
        if (casino.inGame) return false
        casino.setted = casino.setted != 0 ? 0 : -1; updateData(3)
    
    })
    $('#casino-red').click(() => {
        
        if (casino.inGame) return false
        casino.setted = casino.setted != 1 ? 1 : -1; updateData(3)
    
    })

    $('#casino-set-game').click(() => {

        var val = +$('#casino-placing').val()

        if (casino.setted == -1) {

            alert('Выбери цвет')
            return

        }

        if (val > casino.max) {

            alert('Поставь меньшую сумму. Максимальная - ' + casino.max)
            return

        }

        $('#game-settings').fadeOut(0)
        $('#game-casino').fadeIn(100)

        setTimeout(() => {

            var casinoNumber = Math.random()
            numbers -= val
            $('#game-number').text(casinoNumber)
            if (casino.setted === 0) {

                if (casinoNumber <= 0.5) {
                    
                    $('#game-status').text(`Победа. Ты выиграл ${val*2}`)
                    numbers += val * 2

                }

                else $('#game-status').text(`Поражение. Ты проиграл ${val}`)

            } else {

                if (casinoNumber >= 0.5) {
                    
                    $('#game-status').text(`Победа. Ты выиграл ${val*2}`)
                    numbers += val * 2
                
                }

                else $('#game-status').text(`Поражение. Ты проиграл ${val}`)

            }

            updateData(0)
            casino.setted = -1
            updateData(3)

        }, 100)

    })

    $('#game-close').click(() => {

        $('#game-casino').fadeOut(0)
        $('#game-settings').fadeIn(0)

    })

    numbersPlus()
    updateData(1)
    updateData(2)

})