rm -rf dist
mkdir dist
webpack --config webpack.config.js
cp -r assets dist
cp index.html about.html dist