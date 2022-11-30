describe('Create template lesson', () => {


    beforeEach(() => {
        cy.login();
        cy.createParentFolder('ParentFolder', 'id_parentFolder');
        cy.createFolder('Folder', 'id_folder', 'id_parentFolder');
        cy.createForTemplateLesson('LessonForTemplate', 'id_lessonForTemplate');

        cy.intercept({
            method: 'GET',
            url: Cypress.env('newPlatformApiUrl') + '/auth/me',
        }).as('matchedUrl')                           // Перехватываем get запрос auth me


        cy.intercept({
            method: 'POST',
            url: Cypress.env('newPlatformApiUrl') + '/material-templates',
        }).as('matchedTemplate')

        cy.intercept({
            method: 'DELETE',
            url: '**/folders/**',
        }).as('matchedDeleteFolders')   //для будущих поколений

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

        cy.contains(Cypress.env('Folder'))
            .parent()
            .parent()
            .find('[aria-haspopup="menu"]')
            .click()
            .then(($menu) => {
                let a = $menu.attr('aria-controls')
                cy.get('div[id="' + a + '"]')
                    .contains('Создать шаблон')
                    .click()
            })
        cy.get('ul>li[role="menuitem"]')
            .eq(5)
            .click()


    })

    afterEach(() => {
        cy.login()
        cy.deleteParentFolder('id_parentFolder')
    })

    it.skip('Основной сценарий - 2 символа', () => {

        cy.get('input[name="title"]')
            .type('fo')
            .should('have.value', 'fo')

        cy.get('button[type="submit"]')
            .click()

        cy.wait('@matchedTemplate').then(({ response }) => {
            expect(response.statusCode).to.eq(201)
        })

        cy.contains('Шаблон fo создан')
            .should('exist')

    })

    it('Альтернативный сценарий - 100 символов', () => {

        cy.get('input[name="title"]')
            .type('Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh ')
            .should('have.value', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh ')

        cy.get('button[type="submit"]')
            .click()

        cy.wait('@matchedTemplate').then(({ response }) => {
            expect(response.statusCode).to.eq(201)
        })

        cy.contains('Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh ')
            .should('exist')
    })

    it('Пустые поля', () => {

        cy.get('button[type="submit"]')
            .click()

        cy.contains('Необходимо заполнить поле')
            .should('exist')
    })

    it('Максимальное кол-во символов', () => {
        cy.get('input[name="title"]')
            .type('Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh e')
            .should('have.value', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh e')

        cy.get('button[type="submit"]')
            .click()

        cy.contains('Введите не менее 1 и не более 80 символов')
            .should('exist')
    })

    it('Повторяющееся название папки', () => {

        cy.createTemplateLesson('TemplateLesson', 'id_folder', 'id_lessonForTemplate', 'id_templateLesson');

        cy.get('input[name="title"]')
            .type('TemplateLesson')
            .should('have.value', 'TemplateLesson')

        cy.get('button[type="submit"]')
            .click()

        cy.contains('Данное название шаблона уже имеется')
            .should('exist')


    })
})