describe('Edit task testing', () => {

    before('Очищаю группы и предметы',() =>{
        cy.login()
        cy.getMySubjects('testSubject')
        cy.deleteAfterSubject('id_subject')
    }) 


    beforeEach( () => {
        cy.login()
        cy.createSubject('testSubject','id_subject')
        cy.createGroup('testGroup','id_subject','id_group')
        cy.createLesson('testLesson','id_group','id_lesson')
        cy.createTask('test_task', 'id_lesson','id_task')    

        
        cy.intercept({
            method: 'PUT',
            url: '**/task/**'
        }).as('matchedUpdateTask')                           

        cy.intercept({
            method: 'GET',
            url: Cypress.env('newPlatformApiUrl')+'/auth/me',
        }).as('matchedAuth')  

        cy.visitGroup('id_subject','id_group')

        
        cy.wait('@matchedAuth') 

        // cy.contains('testLesson')
        // .parent().parent()
        // .find('label')
        // .wait(1000)
        // .click()
        // .wait(1000)

        cy.contains('testLesson')
        .parent().parent().parent()
        .find('svg[data-testid="KeyboardArrowDownIcon"]')
        .wait(1000)
        .click()
        .wait(1000)

        cy.contains('test_task')
        .parent()
        .parent()
        .find('[data-testid="EditIcon"]')
        .click()
        .wait(500)
    })

    afterEach(() =>{
        cy.login()
        cy.getMySubjects('testSubject')
        cy.deleteAfterSubject('id_subject')
    })

    it.skip('Основной сценарий - редактирование классной работы', () => {

        cy.get('input[name="title"]')
        .clear()
        .type('test')
        .should('have.value', 'test')

        cy.contains('Классной работой')
            .click()

        cy.contains('Домашним заданием')
            .click()

        cy.contains('Сохранить изменения')
        .parents('form')
        .find('button')
        .click()

        cy.wait('@matchedUpdateTask').then(({response})=>{
            expect(response.statusCode).to.eq(200)
            expect(response.body.type).to.eq('homework')
        })

        cy.contains('Изменения сохранены')
        .should('exist')
    
    })

    it.skip('Пустые поля', () => {

        cy.get('input[name="title"]')
            .clear()

        cy.contains('Сохранить изменения')
            .parents('form')
            .find('button')
            .click()

        cy.contains('Необходимо заполнить поле')
        .should('exist')
    })

    it.skip('Максимальное недопустимое кол-во символов классная работа', () => {

        cy.get('input[name="title"]')
            .clear()
            .type('123456789012345678901234567890123456789012345612345678901234567890123456789011111')
        .should('have.value', '123456789012345678901234567890123456789012345612345678901234567890123456789011111')

        cy.contains('Сохранить изменения')
            .parents('form')
            .find('button')
            .click()

        cy.contains('Введите не менее 1 и не более 80 символов')
        .should('exist')
    })

    it.skip('Максимальное недопустимое кол-во символов домашняя работа', () => {

        cy.get('input[name="title"]')
            .clear()
            .type('123456789012345678901234567890123456789012345612345678901234567890123456789011111')
            .should('have.value', '123456789012345678901234567890123456789012345612345678901234567890123456789011111')

        cy.contains('Классной работой')
            .click()

        cy.contains('Домашним заданием')
            .click()
        cy.contains('Сохранить изменения')
            .parents('form')
            .find('button')
            .click()

        cy.contains('Введите не менее 1 и не более 80 символов')
            .should('exist')
    })

    it.skip('Максимальное кол-во символов классная работа', () => {

        cy.get('input[name="title"]')
            .clear()
            .type('12345678901234567890123467890123456789012345612345678901234567890123456789011111')
        .should('have.value', '123456789012345678901234567890123456789012345612345678901234567890123456789011111')

        cy.contains('Сохранить изменения')
            .parents('form')
            .find('button')
            .click()

        cy.contains('Изменения сохранены')
        .should('exist')
    })

    it.skip('Максимальное кол-во символов домашняя работа', () => {

        cy.get('input[name="title"]')
            .clear()
            .type('12345678901234568901234567890123456789012345612345678901234567890123456789011111')
            .should('have.value', '123456789012345678901234567890123456789012345612345678901234567890123456789011111')

        cy.contains('Классной работой')
            .click()

        cy.contains('Домашним заданием')
            .click()
        cy.contains('Сохранить изменения')
            .parents('form')
            .find('button')
            .click()

        cy.contains('Изменения сохранены')
            .should('exist')
    })

    it.skip('Минимальное кол-во символов классная работа', () => {

        cy.get('input[name="title"]')
            .clear()
            .type('1')
            .should('have.value', '1')

        cy.contains('Сохранить изменения')
            .parents('form')
            .find('button')
            .click()

        cy.contains('Изменения сохранены')
            .should('exist')
    })

    it.skip('Минимальное кол-во символов домашняя работа', () => {

        cy.get('input[name="title"]')
            .clear()
            .type('1')
            .should('have.value', '1')

        cy.contains('Классной работой')
            .click()

        cy.contains('Домашним заданием')
            .click()

        cy.contains('Сохранить изменения')
            .parents('form')
            .find('button')
            .click()

        cy.contains('Изменения сохранены')
            .should('exist')
    })

    it('Название урока уже используется', () => {

        cy.contains('Редактирование задания')
        .parent()
        .parent()
        .parent()
        .find('[data-testid="CloseIcon"]')
        .click()
        .wait(500)

        cy.contains('Для создания задания добавьте материал из меню слева или нажмите на кнопку')
        .click()

        cy.get('input[name="title"]')
        .clear()
        .type('test')
        .should('have.value', 'test')

        cy.contains('Создать задание')
        .parents('form')
        .find('button')
        .click()

        cy.contains('test_task')
        .parent()
        .parent()
        .find('[data-testid="EditIcon"]')
        .click()
        
        cy.get('input[name="title"]')
        .wait(500)
        .clear()
        .type('test')

        cy.contains('Сохранить изменения')
            .parents('form')
            .find('button')
            .click()

        cy.contains('Данное название задания уже имеется, введите другое название')
        .should('exist')
    })

})