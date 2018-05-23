package com.joshua.data;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by joshua on 2016/5/16.
 */
public class ReadHtmlBySelenium {
//
//    private NodesHierarchyFacade nodesHierarchyFacade;
//    private TestCaseFacade testCaseFacade;

    public ReadHtmlBySelenium() {
    }

//    @Inject
//    public ReadHtmlBySelenium(NodesHierarchyFacade nodesHierarchyFacade, TestCaseFacade testCaseFacade) {
//        this.nodesHierarchyFacade = nodesHierarchyFacade;
//        this.testCaseFacade = testCaseFacade;
//    }

//    public void test() throws Exception {
//
//        PrintWriter printWriter = new PrintWriter("text.txt", "UTF-8");
//        System.setProperty("webdriver.chrome.driver", "src\\main\\resources\\chromedriver.exe");
//        WebDriver driver = new ChromeDriver();
//        driver.manage().timeouts().implicitlyWait(1, TimeUnit.SECONDS);
//        driver.manage().timeouts().pageLoadTimeout(30, TimeUnit.SECONDS);
//
//        String url = "file:///E:/%E5%B7%A5%E4%BD%9C%E6%96%87%E6%A1%A3/%E6%B5%8B%E8%AF%95%E6%96%87%E6%A1%A3/%E6%9D%8E%E6%B4%8B%E6%B4%8B/%E8%AF%84%E5%AE%A1%E6%96%87%E6%A1%A3/04-1%E6%9C%9F-%E6%B5%8B%E8%AF%95%E7%94%A8%E4%BE%8B/DH2011-SRS01-28160-%E7%97%85%E6%A1%88%E6%B5%81%E9%80%9A%E7%B3%BB%E7%BB%9F%E6%B5%8B%E8%AF%95%E7%94%A8%E4%BE%8B.html";
//        WebDriver.Navigation navigation = driver.navigate();
//        navigation.to(url);
//
//        try {
//            for (int i = 1; true; i++) {
//                String xpath = "/html/body/p[" + i + "]";
//                WebElement webElement = driver.findElement(By.xpath(xpath));
//                if (webElement.getText() != null && isContainChinese(webElement.getText())) {
//                    testSuite("07", webElement.getText(), printWriter);
////                    try {
////                        WebElement tableElement = driver.findElement(By.xpath(xpath+"/following-sibling::table"));
////                    }catch (Exception e){
////
////                    }
////                    try {
////                        for (int j=2;true;j++){
////                            WebElement trElement = driver
////                                    .findElement(By.xpath(xpath+"/following-sibling::table/tbody/tr[" + j + "]"));
////                            WebElement tdTestSummaryElement = driver
////                                    .findElement(By.xpath(xpath+"/following-sibling::table/tbody/tr[" + j + "]/td[2]"));
////                            WebElement tdTestStepElement = driver
////                                    .findElement(By.xpath(xpath+"/following-sibling::table/tbody/tr[" + j + "]/td[2]"));
////                            try {
////                                for (int k = 1; true; k++) {
////                                    WebElement tdTestStepOneElement = driver
////                                            .findElement(By.xpath(xpath + "/following-sibling::table/tbody/tr[" + j +
////                                                    "]/td[2]/p[" + k + "]/span[2]"));
////
////                                }
////                            }catch (Exception e){
////                                System.out.println("查找元素错误");
////                            }
////                            WebElement tdTestPreconditionsElement = driver.findElement(By.xpath(xpath+"/following-sibling::table/tbody/tr[" + j + "]/td[2]"));
////                            printWriter.print(trElement.getText());
////                        }
////                    }catch (Exception e){
////
////                    }
//                }
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//        printWriter.close();
//        driver.quit();
//    }

//    public NodesHierarchy testSuite(String root, String title, PrintWriter printWriter) {
//        NodesHierarchy nodesHierarchy = new NodesHierarchy();
//        String[] split = title.split(" ");
//
//        for (int i = 0; i < 5; i++) {
//            if (split[0].length() == 1 + i * 2) {
//                String[] firstTitle = split[0].split("\\.");
//                for (int j = 0; j < firstTitle.length; j++) {
//                    if (firstTitle[j].length() == 1) {
//                        firstTitle[j] = '0' + firstTitle[j];
//                    }
//                }
//                String secondTitle = String.join("", firstTitle);
//                nodesHierarchy.setId(root + secondTitle);
//                nodesHierarchy.setName(split[1]);
//                nodesHierarchy.setNodeTypeId(2);
//                nodesHierarchy.setParentId(root + secondTitle.substring(0, secondTitle.length() - 2));
//                nodesHierarchy.setNodeOrder(Integer.valueOf(secondTitle.substring(secondTitle.length() - 2)));
//                printWriter.println(nodesHierarchy.toString());
////                nodesHierarchyFacade.addNodeHierarchy(nodesHierarchy);
//            }
//        }
//        return null;
//    }

//    public void testCase() throws Exception {
//
//        PrintWriter printWriter = new PrintWriter("text.txt", "UTF-8");
//        System.setProperty("webdriver.chrome.driver", "src\\main\\resources\\chromedriver.exe");
//        WebDriver driver = new ChromeDriver();
//        driver.manage().timeouts().implicitlyWait(1, TimeUnit.SECONDS);
//        driver.manage().timeouts().pageLoadTimeout(30, TimeUnit.SECONDS);
//
//        String url = "file:///E:/%E5%B7%A5%E4%BD%9C%E6%96%87%E6%A1%A3/%E6%B5%8B%E8%AF%95%E6%96%87%E6%A1%A3/%E6%9D%8E%E6%B4%8B%E6%B4%8B/%E8%AF%84%E5%AE%A1%E6%96%87%E6%A1%A3/04-1%E6%9C%9F-%E6%B5%8B%E8%AF%95%E7%94%A8%E4%BE%8B/DH2011-UC01-28020-%E9%97%A8%E8%AF%8A%E6%8C%82%E5%8F%B7%E6%B5%8B%E8%AF%95%E7%94%A8%E4%BE%8B.html";
//        WebDriver.Navigation navigation = driver.navigate();
//        navigation.to(url);
//
//        CsvUtil csvUtil = new CsvUtil("E:\\workspace\\test-sourcecode\\heren-test\\src\\main\\resources\\clinic.csv");
//
//        String[] title = csvUtil.getCol(0).split(",");
//
//        try {
//            for (int i = 1; true; i++) {
//                String xpath = "/html/body/table[" + i + "]/tbody";
//                WebElement webElement = driver.findElement(By.xpath(xpath));
//                if (webElement.getText() != null && isContainChinese(webElement.getText())) {
//                    try {
//                        for (int j = 1; true; j++) {
//                            TestCase testCase = new TestCase();
//                            testCase.setNodeId(title[i-1]);
//                            WebElement td1 = driver.findElement(By.xpath(xpath + "/tr[" + j + "]/td[1]"));
//                            testCase.setTestCaseId(title[i-1] + String.format("%02d",j));
//                            WebElement td2 = driver.findElement(By.xpath(xpath + "/tr[" + j + "]/td[2]"));
//                            testCase.setSummary(td2.getText());
//                            List<TestCaseSteps> testCaseStepsList = new ArrayList<>();
//                            try {
//                                for (int k = 1; true; k++) {
//                                    TestCaseSteps testCaseSteps = new TestCaseSteps();
//                                    testCaseSteps.setActive(1);
//                                    testCaseSteps.setTestCaseStepsPk(new TestCaseStepsPk(testCase.getTestCaseId(), k));
//                                    WebElement webElementP = driver.findElement(By.xpath(xpath + "/tr[" + j + "]/td[3]/p[" + k + "]/span[2]"));
//                                    testCaseSteps.setActions(webElementP.getText());
//                                    testCaseStepsList.add(testCaseSteps);
//                                    testCaseSteps.setExecutionType(1);
//                                }
//                            } catch (Exception e) {
//
//                            }
//                            testCase.setTestCaseStepsList(testCaseStepsList);
//                            WebElement td5 = driver.findElement(By.xpath(xpath + "/tr[" + j + "]/td[5]"));
//                            //对测试结果进行分段处理
//                            testCase.setPreconditions(td5.getText());
//                            testCase.setExecutionType(1);
//                            printWriter.println(testCase.toString());
//                            testCaseFacade.addTestCase(testCase);
//                        }
//                    } catch (Exception e) {
//                        e.printStackTrace();
//                    }
//                }
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//        printWriter.close();
//        driver.quit();
//    }

    public static boolean isContainChinese(String str) {

        Pattern p = Pattern.compile("[\u4e00-\u9fa5]");
        Matcher m = p.matcher(str);
        if (m.find()) {
            return true;
        }
        return false;
    }
}
