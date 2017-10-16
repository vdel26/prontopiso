## How-to
To get this website up and running you just need to clone this repository in your computer and run the following commands from your Terminal.app.
```
git clone https://github.com/hacknug/prontopiso.git
cd prontopiso
npm install
bundle install
jekyll build
gulp
```
----

If you ever need to make changes to the framework styles of the website, edit the `_variables.scss` file and use the following command to regenerate everything.
```
gulp styles
```
If you want to learn more about the framework, please visit the [tachyons-uber](https://github.com/hacknug/tachyons-uber) repository on GitHub.
