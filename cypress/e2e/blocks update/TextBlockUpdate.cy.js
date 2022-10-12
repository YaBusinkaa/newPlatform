describe('Text block update testing', () => {

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
        cy.createTask('testTask', 'id_lesson','id_task')
        cy.createBlockText('testBlock','id_task', 'id_block')

        
        cy.intercept({
            method: 'PUT',
            url: '**/block/**',
        }).as('matchedUpdateText')                           

        cy.intercept({
            method: 'GET',
            url: Cypress.env('newPlatformApiUrl')+'/auth/me',
        }).as('matchedAuth')  

        cy.intercept({
            method: 'POST',
            url: 'https://uploader.ipst-dev.com/text/upload',
        }).as('matchedUploader')  

        cy.visitGroup('id_subject','id_group')

        
        cy.wait('@matchedAuth') 

        cy.contains('testLesson')
        .parent()
        .parent()
        .find('[data-testid="KeyboardArrowDownIcon"]')
        .click()
        .wait(500)

        cy.contains('testTask')
        .parent()
        .parent()
        .find('[data-testid="KeyboardArrowDownIcon"]')
        .click()
        .wait(500)

        cy.contains('testBlock')
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


    it.skip('Основной сценарий - редактирование текстового блока', () => {

        cy.get('input[name="title"]')
            .clear()
            .type('ff')

            cy.get('[role="textbox"]')
            .clear()
            .type('аа')

        cy.get('button[type="submit"]')
            .click()

        cy.contains('Ваш текст успешно изменён')
            .should('exist')
        
    })

    it.skip('Альтернативный сценарий - пустые поля', () => {
        
        cy.get('input[name="title"]')
            .clear()

            cy.get('[role="textbox"]')
            .clear()

        cy.get('button[type="submit"]')
            .click()

        cy.contains('Заполните название')
            .should('exist')
    })


    it('Альтернативный сценарий - максимальное количество символов текстового поля "название поля" ', () => {

        cy.get('input[name="title"]')
        .type('Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea c')
        
        cy.get('button[type="submit"]')
            .click()

        cy.contains('Введеное название не должен превышать 255 символов')
            .should('exist')

    })

    it.skip('Альтернативный сценарий - максимальное количество символов текстового поля "текст поля" ', () => {

        cy.get('[role="textbox"]')
        .type('Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero e')

        cy.get('button[type="submit"]')
            .click()

        cy.contains('Введите не менее 1 и не более 1500 символов')
            .should('exist')

    })
})