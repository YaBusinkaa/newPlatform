describe('Update folder', () => {


    beforeEach(() => {
        cy.login();
        cy.createParentFolder('ParentFolder', 'id_parentFolder');
        cy.createFolder('Folder', 'id_folder', 'id_parentFolder');

        cy.intercept({
            method: 'GET',
            url: Cypress.env('newPlatformApiUrl') + '/auth/me',
        }).as('matchedUrl')                           // Перехватываем get запрос auth me


        cy.intercept({
            method: 'PUT',
            url: '**/folders/**',
        }).as('matchedUpdateFolder')

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
                    .contains('Редактировать папку')
                    .click()
            });
    })

    afterEach(() => {
        cy.login()
        cy.deleteParentFolder('id_parentFolder')
    })

    it.skip('Основной сценарий - 2 символа', () => {

        cy.get('input[name="folderTitle"]')
            .clear()
            .type('fo')
            .should('have.value', 'fo')

        cy.get('button')
            .contains('Переименовать')
            .click()

        cy.wait('@matchedUpdateFolder').then(({ response }) => {
            expect(response.statusCode).to.eq(200)
        })

        cy.contains('Название папки успешно изменено')
            .should('exist')

    })

    it.skip('Альтернативный сценарий - 100 символов', () => {

        cy.get('input[name="folderTitle"]')
            .clear()
            .type('Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut')
            .should('have.value', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut')

        cy.get('button')
            .contains('Переименовать')
            .click()

        cy.wait('@matchedUpdateFolder').then(({ response }) => {
            expect(response.statusCode).to.eq(200)
        })

        cy.contains('Название папки успешно изменено')
            .should('exist')
    })

    it.skip('Пустые поля', () => {

        cy.get('input[name="folderTitle"]')
            .clear()

        cy.get('button')
            .contains('Переименовать')
            .click()

        cy.contains('Необходимо задать название папки')
            .should('exist')
    })

    it.skip('Максимальное кол-во символов', () => {
        cy.get('input[name="folderTitle"]')
            .clear()
            .type('Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut ')
            .should('have.value', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut ')

            cy.get('button')
            .contains('Переименовать')
            .click()

        cy.contains('Введите не более 100 символов')
            .should('exist')
    })

    it('Повторяющееся название папки', () => {

        cy.get('input[name="folderTitle"]')
        .clear()
        .type('Folder')
        .should('have.value', 'Folder')

        cy.get('button')
            .contains('Переименовать')
            .click()

        cy.contains('Данное название папки уже имеется')
        .should('exist') 


    })
})