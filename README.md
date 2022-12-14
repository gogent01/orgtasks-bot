# orgtasks-bot

## Description
๐งช This bot was designed to help high school Chemistry teachers. It uses pre-drawn images of organic reactions stored on any publicly available url ๐. 

๐ The bot builds a database of reactions and allows to tag a theme, a mechanism and a difficulty level for each reaction. Then it allows creating PDF documents for students on any available theme and difficulty level ๐. The ordering of reactions is random and the number of reactions in work is determined by the teacher.

๐ฉโ๐๐จโ๐ The students get reactions with left (substrate), middle (reagent) or right (product) parts hidden. The generated works include 4 sections: 
- the reactions of the first section come with no product;
- the reactions of the second section miss reagents;
- the reactions of the third section have no substrate;
- the last section contains reactions with randomly missing pieces.

๐งโ๐ซ The teacher gets the same PDF document but with no parts missing. Thus, the bot helps to generate any number of unique works of any length and theme with reactions of organic chemistry.


## Input
๐ฅ Orgtasks-bot requires only having the images of organic reactions. They should be divided into three images presenting the left, middle and right reaction parts. All the images should be sequentially numerated (see an example image below) and stored on publicly available url.

![Example reaction images](/server/assets/readme/reaction_images.png)


## Output

๐ค Being provided the required theme, difficulty and size of work the bot generates two files: one for students and one for a teacher. Example files can be viewed by following these links: [students' file](/server/assets/readme/Alkynes_tasks.pdf) and [teacher's file](/server/assets/readme/Alkynes_answers.pdf).
