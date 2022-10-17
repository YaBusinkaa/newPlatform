const d = new Date()
d.setDate(d.getDate() + 1);
describe('Edit Lesson', () => {

    before('Очищаю предметы',() =>{
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
            url: Cypress.env('newPlatformApiUrl')+'/auth/me',
        }).as('matchedAuth') 

        cy.intercept({
            method: 'PUT',
            url: '**/lessons/**'
        }).as('matchedEditLesson')                            

        cy.visitGroup('id_group')
        cy.wait('@matchedAuth')


        cy.contains('test_lesson')
        .parent().parent()
        .find('svg[data-testid="EditIcon"]')
        .wait(1000)
        .click()
        .wait(1000)          
    })

    afterEach(()=>{
        cy.deleteSubject('id_subject')
    })


    it('Основной сценарий - редактирование урока', () => {

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
        .clear()
        .wait(1000)
        .type('edit_lesson')
        .should('have.value', 'edit_lesson')

        cy.contains('Сохранить изменения')
        .parents('form')
        .find('button')
        .click()

        cy.wait('@matchedEditLesson').then(({response})=>{
            expect(response.statusCode).to.eq(200)
            expect(response.body.title).to.eq('edit_lesson')
        })

        cy.contains('Изменения сохранены!')
        .should('exist')
    
    })

    it('Пустые поля - название урока', () => {

        cy.get('input[name="title"]')
        .clear()
        .wait(1000)

        cy.contains('Сохранить изменения')
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
        .clear()
        .wait(1000)
        .type('123456789012345678901234567890123456789012345612345678901234567890123456789011111')
        .should('have.value', '123456789012345678901234567890123456789012345612345678901234567890123456789011111')

        cy.contains('Сохранить изменения')
        .parents('form')
        .find('button')
        .click()

        cy.contains('Введите не менее 2 и не более 80 символов')
        .should('exist')
    })

    it('Название урока уже используется', () => {
        cy.createLesson('already_lesson', 'id_group', 'already_lesson')
        
        cy.get('input[name="title"]')
        .clear()
        .wait(1000)
        .type('already_lesson')
        .should('have.value', 'already_lesson')

        cy.contains('Сохранить изменения')
        .parents('form')
        .find('button')
        .click()

        cy.contains('Данное название урока уже имеется, введите другое название')
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

        cy.contains('Сохранить изменения')
        .parents('form')
        .find('button')
        .click()

        cy.wait('@matchedEditLesson').then(({response})=>{
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

        cy.contains('Сохранить изменения')
        .parents('form')
        .find('button')
        .click()

        cy.wait('@matchedEditLesson').then(({response})=>{
            expect(response.statusCode).to.eq(500)
        })

        cy.contains('Internal server error')
        .should('exist')
    
    })


})