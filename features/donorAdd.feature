Feature: 
    In order to send them Donation Requests, users should be able to add donors to the system.

    
    Scenario: Users should be able to add donors.
        Given I am logged in as the example user
        And I am on the donors page
        And I click on "add donor"
        Then I should see a add donor form
        And when I fill in the name field with the name of the example donor
        And when I fill in the company field with the company of the example donor

        And I click on "Save"
        Then should see a success message
