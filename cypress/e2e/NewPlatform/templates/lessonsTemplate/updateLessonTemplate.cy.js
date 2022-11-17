describe('Update template lesson', () => {


    beforeEach(() => {
        cy.login();
        cy.createParentFolder('ParentFolder', 'id_parentFolder');
        cy.createFolder('folder', 'id_folder', 'id_parentFolder');
        cy.createForTemplateLesson('LessonForTemplate','id_lessonForTemplate')
        cy.createTemplateLesson('TemplateLesson',  'id_folder', 'id_lessonForTemplate', 'id_templateLesson');

        cy.intercept({
            method: 'GET',
            url: Cypress.env('newPlatformApiUrl') + '/auth/me',
        }).as('matchedUrl')                           // Перехватываем get запрос auth me


        cy.intercept({
            method: 'PUT',
            url: '**/material-templates/**',
        }).as('matchedTemplateUpdate')

        cy.intercept({
            method: 'DELETE',
            url: '**/folders/**',
        }).as('matchedDeleteFolders')   

        cy.visit(Cypress.env('newPlatformUrl'))

        cy.wait('@matchedUrl')

        cy.get('p')
            .contains('Моё')
            .click()
        cy.wait(1000)

        cy.get('p')
            .contains('ParentFolder')
            .click()
        cy.wait(1000)

        cy.get('p')
            .contains('folder')
            .click()
        cy.wait(1000)

        cy.contains(Cypress.env('Folder'))
            .parent()
            .parent()
            .find('[aria-haspopup="menu"]')
            .eq(1)
            .click()
            .then(($menu) => {
                let a = $menu.attr('aria-controls')
                cy.get('div[id="' + a + '"]')
                    .contains('Редактировать шаблон')
                    .click()
            })           

    })

    afterEach(() => {
        cy.login()
        cy.deleteParentFolder('id_parentFolder')
    })

    it.skip('Основной сценарий - 2 символа', () => {

        cy.get('input[name="templateTitle"]')
            .clear()
            .type('fo')
            .should('have.value', 'fo')

        cy.get('button')
            .contains('Переименовать')
            .click()

        cy.wait('@matchedTemplateUpdate').then(({ response }) => {
            expect(response.statusCode).to.eq(200)
        })

        cy.contains('Название шаблона успешно изменено')
            .should('exist')
    })

    it.skip('Альтернативный сценарий - 100 символов', () => {

        cy.get('input[name="templateTitle"]')
            .clear()
            .type('Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut')
            .should('have.value', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut')

        cy.get('button')
            .contains('Переименовать')
            .click()

        cy.wait('@matchedTemplateUpdate').then(({ response }) => {
            expect(response.statusCode).to.eq(200)
        })

        cy.contains('Название шаблона успешно изменено')
            .should('exist')
    })

    it.skip('Пустые поля', () => {

        cy.get('input[name="templateTitle"]')
            .clear()

        cy.get('button')
            .contains('Переименовать')
            .click()

        cy.contains('Необходимо задать название шаблона')
            .should('exist')
    })

    it.skip('Максимальное кол-во символов', () => {

        cy.get('input[name="templateTitle"]')
            .clear()
            .type('Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut ')
            .should('have.value', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut ')

        cy.get('button')
            .contains('Переименовать')
            .click()

        cy.contains('Введите не более 100 символов')
            .should('exist')
    })
})