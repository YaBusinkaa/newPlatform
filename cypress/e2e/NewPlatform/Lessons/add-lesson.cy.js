const d = new Date()
d.setDate(d.getDate() + 1);
describe('Add lesson', () => {

    before('Очищаю группы и предметы',() =>{
        cy.login()
        cy.getMySubjects('test_subject')
        cy.deleteAfterSubject('id_subject')
    })

    beforeEach( () => {
        cy.login();
        cy.createSubject('test_subject', 'id_subject')
        cy.createGroup('test_group', 'id_subject', 'id_group')
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
            url: '**/lessons**'
        }).as('matchedCreateLessons')                            

        cy.visitGroup('id_subject','id_group')
        cy.wait('@matchedAuth')
        cy.wait(1000)
        cy.get('svg[data-testid="AddCircleIcon"]')
        .parents('button')
        .click()
        cy.wait(2000)          
    })

    afterEach(()=>{
        cy.deleteSubject('id_subject')
    })


    it('Основной сценарий - создание урока', () => {

        cy.get('input[name="lessonTimestamp"]')
        .click({force: true})
        .wait(1000)
        
        cy.get('svg[data-testid="PenIcon"]')
        .click()
        .wait(1000)

        cy.get('input[placeholder="dd.mm.yyyy hh:mm"]')
        .clear()
        .type(d.toLocaleDateString()+' 12:000')

        cy.contains('Ок')
        .click()

        cy.get('input[name="title"]')
        .type('test_lesson')

        cy.contains('Создать новый урок')
        .parents('form')
        .find('button')
        .click()

        cy.wait('@matchedCreateLessons').then(({response})=>{
            expect(response.statusCode).to.eq(201)
            expect(response.body.title).to.eq('test_lesson')
        })

        cy.contains('Урок успешно создан!')
        .should('exist')
    
    })

    it('Пустые поля - название урока', () => {

        cy.contains('Создать новый урок')
        .parents('form')
        .find('button')
        .click()

        cy.contains('Необходимо заполнить поле')
        .should('exist')
    })

   /* it('Пустые поля - дата', () => {

        cy.get('input[name="lessonTimestamp"]')
        .click({force: true})
        .wait(1000)
        
        cy.get('svg[data-testid="PenIcon"]')
        .click()
        .wait(1000)

        cy.get('input[placeholder="dd.mm.yyyy hh:mm"]')
        .clear()

        cy.contains('Ок')
        .click()

        cy.get('input[name="title"]')
        .type('test_lesson')

        cy.contains('Создать новый урок')
        .parents('form')
        .find('button')
        .click()

        cy.contains('Необходимо заполнить поле')
        .should('exist')
    })
    */

    it('Максимальное кол-во символов', () => {
      
        cy.get('input[name="title"]')
        .type('123456789012345678901234567890123456789012345612345678901234567890123456789011111')
        .should('have.value', '123456789012345678901234567890123456789012345612345678901234567890123456789011111')

        cy.contains('Создать новый урок')
        .parents('form')
        .find('button')
        .click()

        cy.contains('Введите не менее 2 и не более 80 символов')
        .should('exist')
    })

    it('Название урока уже используется', () => {
        cy.createLesson('test_lesson', 'id_group', 'id_lesson')
        
        cy.get('input[name="title"]')
        .type('test_lesson')

        cy.contains('Создать новый урок')
        .parents('form')
        .find('button')
        .click()

        cy.contains('Урок с таким названием уже существует в этой группе')
        .should('exist')
    })

    it('Прошедшая дата', () => {

        d.setDate(d.getDate() - 2);

        cy.get('input[name="lessonTimestamp"]')
        .click({force: true})
        .wait(1000)
        
        cy.get('svg[data-testid="PenIcon"]')
        .click()
        .wait(1000)

        cy.get('input[placeholder="dd.mm.yyyy hh:mm"]')
        .clear()
        .type(d.toLocaleDateString()+' 12:000')

        cy.contains('Ок')
        .click()

        cy.get('input[name="title"]')
        .type('test_lesson')

        cy.contains('Создать новый урок')
        .parents('form')
        .find('button')
        .click()

        cy.wait('@matchedCreateLessons').then(({response})=>{
            expect(response.statusCode).to.eq(400)
            expect(response.body.message).to.eq('Дата не актуальна. Введена прошедшая дата')
        })

        cy.contains('Дата не актуальна. Введена прошедшая дата')
        .should('exist')
    
    })

    it('Неверный формат даты', () => {
        cy.get('input[name="lessonTimestamp"]')
        .click({force: true})
        .wait(1000)
        
        cy.get('svg[data-testid="PenIcon"]')
        .click()
        .wait(1000)

        cy.get('input[placeholder="dd.mm.yyyy hh:mm"]')
        .clear()
        .type('99999192999213')

        cy.contains('Ок')
        .click()

        cy.get('input[name="title"]')
        .type('test_lesson')

        cy.contains('Создать новый урок')
        .parents('form')
        .find('button')
        .click()

        cy.wait('@matchedCreateLessons').then(({response})=>{
            expect(response.statusCode).to.eq(500)
        })

        cy.contains('Internal server error')
        .should('exist')
    
    })


})