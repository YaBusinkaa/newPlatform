describe('Add Task', () => {

    before('Очищаю группы и предметы',() =>{
        cy.login()
        cy.getMySubjects('test_subject')
        cy.deleteAfterSubject('id_subject')
    })

    beforeEach( () => {
        cy.login();
        cy.createSubject('test_subject', 'id_subject')
        cy.createGroup('test_group', 'id_subject', 'id_group')
        cy.createLesson('test_lesson', 'id_group', 'id_lesson')

        cy.intercept({
            method: 'GET',
            url: '**/groups/**',
        }).as('matchedUrl')
          
        cy.intercept({
            method: 'GET',
            url: Cypress.env('newPlatformApiUrl')+'/auth/me',
        }).as('matchedAuth')

        cy.intercept({
            method: 'POST',
            url: '**/task**'
        }).as('matchedCreateTask')                            

        cy.visitGroup('id_group').then(({response})=> {
            expect(response.statusCode).to.eq(200)
        })
        cy.wait('@matchedAuth')
        cy.wait(1000)

        cy.contains('test_lesson')
        .parent().parent()
        .find('label')
        .wait(1000)
        .click()
        .wait(1000)

        cy.contains('test_lesson')
        .parent().parent().parent()
        .find('svg[data-testid="AddCircleIcon"]')
        .wait(1000)
        .click()
        .wait(1000)
        
         
    })

    afterEach(()=>{
        cy.deleteSubject('id_subject')
    })


    it('Основной сценарий - создание классной работы', () => {

        cy.get('input[name="title"]')
        .type('test_task')
        .should('have.value', 'test_task')

        cy.contains('Создать задание')
        .parents('form')
        .find('button')
        .click()

        cy.wait('@matchedCreateTask').then(({response})=>{
            expect(response.statusCode).to.eq(201)
            expect(response.body.title).to.eq('test_task')
            expect(response.body.type).to.eq('classwork')
        })

        cy.contains('Классное задание test_task успешно создана!')
        .should('exist')
    
    })

    it('Основной сценарий - создание домашней работы', () => {

        cy.get('input[name="title"]')
        .type('test_task')
        .should('have.value', 'test_task')

        cy.contains('Классной работой')
        .click()
        .wait(1000)

        cy.contains('Домашним заданием')
        .click()
        .wait(1000)

        cy.contains('Создать задание')
        .parents('form')
        .find('button')
        .click()

        cy.wait('@matchedCreateTask').then(({response})=>{
            expect(response.statusCode).to.eq(201)
            expect(response.body.title).to.eq('test_task')
            expect(response.body.type).to.eq('homework')
        })

        cy.contains('Домашнее задание test_task успешно создана!')
        .should('exist')
    
    })

    it('Пустые поля', () => {

        cy.contains('Создать задание')
        .parents('form')
        .find('button')
        .click()

        cy.contains('Необходимо заполнить поле')
        .should('exist')
    })

    it('Максимальное кол-во символов', () => {
      
        cy.get('input[name="title"]')
        .type('123456789012345678901234567890123456789012345612345678901234567890123456789011111')
        .should('have.value', '123456789012345678901234567890123456789012345612345678901234567890123456789011111')

        cy.contains('Создать задание')
        .parents('form')
        .find('button')
        .click()

        cy.contains('Введите не менее 1 и не более 80 символов')
        .should('exist')
    })

    it('Название урока уже используется', () => {
        cy.createTask('test_task', 'id_lesson', 'id_task')
        
        cy.get('input[name="title"]')
        .type('test_task')
        .should('have.value', 'test_task')

        cy.contains('Создать задание')
        .parents('form')
        .find('button')
        .click()

        cy.contains('Данное название задания уже имеется, введите другое название')
        .should('exist')
    })


})