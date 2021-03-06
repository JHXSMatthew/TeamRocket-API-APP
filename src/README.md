# Spring backend source
This is the folder for java source files. pure backend.

## Getting Started
### Introduction
We are going to use

- Spring + Spring MVC framework based on Java
- Javascript/CSS/HTML

to code an API and further web software.

### Set up
Just in case everyone prefers to use Eclipse, Maven is in use in order to keep our dependencies consistent.
To set up the project dev env, you may need:
- [Java 8 JDK](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
- [Maven](https://maven.apache.org/download.cgi) (mine was 3.3.3 but as long as its maven 3 it will do)
- Eclipse IDE

There should be tutorial on how to install tools above, if you have any problem with setting up please let me know.
Spring framework will automatically be downloaded and used as dependency. 

There is something called [Spring tool suit](https://spring.io/tools/sts) which is an Eclipse-based development environment.I have never used that but it might be a good idea to look into it if you want.
You may use IntelliJ IDEA as you want either.

if you are simply using Eclipse,

- `git clone https://github.com/JHXSMatthew/SENG3011` to download the project
- import -> maven -> Existing maven project -> choose the directory and pick the pom.xml ->finish
- enjoy
 
### Install

install would be super simple as we are using Maven. 
Just make sure you have installed maven properly.
- open a terminal/cmd go to the project home directory and type `mvn install`
- the War file would be in target folder , and you can run the Spring internal web server by typing
`java -jar FILE_NAME_HERE`. 
- go to the browser and go `127.0.0.1:8080` . You should see hello world. 

### Development 101

I believe everyone had experiences with Java,  just to make sure everyone understands what's going on here.
`AustralianStatistics` and `ServletInitializer` class are just for our application to set up.
`exampleController` is considered as a backend controller that process clients requests.The annotation
` @RequestMapping("/")` maps this controller to ROOT URL so when our client try HTTP our website, this controller 
would handle it.

If I am confusing you, here are some more professional explanations and resources here:

- [Model-View-Controller(MVC)](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)
- [Official Spring guide](https://spring.io/guides)
- [Spring MVC tutorial](http://www.mkyong.com/tutorials/spring-mvc-tutorials/)

### API


Note:Their sample output JSON sucks, format error etc, completely unreadable. If you want to see what's actually output JSON, check /example.json.


We are provided an [API](http://stat.data.abs.gov.au/) for our data source.

Here is a [link](http://stat.data.abs.gov.au/restsdmx/sdmx.ashx/GetDataStructure/RT) indicates all possible data structures for RT

[link](http://stat.data.abs.gov.au/restsdmx/sdmx.ashx/GetDataStructure/MERCH_EXP) for Merchandise Exports.


this api using to represent "state,type of retailing industry etc"
(like, the id for states or whatever) 

and there is a [sample output data](http://stat.data.abs.gov.au/sdmx-json/data/RT/0.2+1.20+41+42+04+05+06+43+44+45+46.10+20+30.M/all?startTime=2016-02&endTime=2017-01&dimensionAtObservation=allDimensions) in JSON format which looks not pretty

please keep this section updating so we share more info about this API.

API dataSet means:

0:0:2:1:0:9 ->
key position 0 ... key position 5
