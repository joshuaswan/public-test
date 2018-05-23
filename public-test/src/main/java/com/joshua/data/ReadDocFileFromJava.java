package com.joshua.data;

import com.google.common.base.Strings;
import org.apache.poi.hpsf.DocumentSummaryInformation;
import org.apache.poi.hwpf.HWPFDocument;
import org.apache.poi.hwpf.extractor.WordExtractor;
import org.apache.poi.hwpf.usermodel.HeaderStories;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;

import java.io.FileInputStream;

/**
 * Created by joshua on 2016/5/1.
 */
public class ReadDocFileFromJava {

    public static void main(String[] args) throws Exception {
//        This it the document that you want to read using Java
        String fileName = "path/of/file.doc";

//        Method call to read the document (demonstrate some useage of POI)

        POIFSFileSystem fileSystem = null;
        fileSystem = new POIFSFileSystem(new FileInputStream(fileName));
        HWPFDocument document = new HWPFDocument(fileSystem);

        WordExtractor wordExtractor = new WordExtractor(document);

        String[] strings = wordExtractor.getParagraphText();

//        String s = strings[19];
//       for (int i=0 ;i<s.length();i++){
//           System.out.println(s.charAt(i)+"---");
//       }
//        System.out.println(strings[19]);
//        System.out.println("---------------------");

        for (int i = 0; i < strings.length; i++) {
            if (!Strings.isNullOrEmpty(strings[i]) && strings[i].length() != 1) {
                if ('\n' == strings[i].charAt(strings[i].length() - 1) || ' ' == strings[i].charAt(strings[i].length() - 1)) {
                    strings[i] = strings[i].substring(0, strings[i].length() - 2);
                }
                System.out.println("-" + strings[i] + "+");
            }
        }
        readMyDocument(fileName);
    }

    public static void readParagraphs(HWPFDocument doc) throws Exception {
        WordExtractor we = new WordExtractor(doc);

        /**Get the total number of paragraphs**/
        String[] paragraphs = we.getParagraphText();
        System.out.println("Total Paragraphs: " + paragraphs.length);

        for (int i = 0; i < paragraphs.length; i++) {

            System.out.println("Length of paragraph " + (i + 1) + ": " + paragraphs[i].length());
            System.out.println(paragraphs[i].toString());

        }

    }

    public static void readMyDocument(String fileName) {
        POIFSFileSystem fs = null;
        try {
            fs = new POIFSFileSystem(new FileInputStream(fileName));
            HWPFDocument doc = new HWPFDocument(fs);

            /** Read the content **/
            readParagraphs(doc);

            int pageNumber = 1;

            /** We will try reading the header for page 1**/
            readHeader(doc, pageNumber);

            /** Let's try reading the footer for page 1**/
            readFooter(doc, pageNumber);

            /** Read the document summary**/
            readDocumentSummary(doc);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void readTitle(HWPFDocument document) throws Exception {
        WordExtractor wordExtractor = new WordExtractor(document);

        Class<? extends WordExtractor> titles = wordExtractor.getClass();

        System.out.println(titles.toString());
    }


    public static void readHeader(HWPFDocument doc, int pageNumber) {
        HeaderStories headerStore = new HeaderStories(doc);
        String header = headerStore.getHeader(pageNumber);
        System.out.println("Header Is: " + header);

    }

    public static void readFooter(HWPFDocument doc, int pageNumber) {
        HeaderStories headerStore = new HeaderStories(doc);
        String footer = headerStore.getFooter(pageNumber);
        System.out.println("Footer Is: " + footer);

    }

    public static void readDocumentSummary(HWPFDocument doc) {
        DocumentSummaryInformation summaryInfo = doc.getDocumentSummaryInformation();
        String category = summaryInfo.getCategory();
        String company = summaryInfo.getCompany();
        int lineCount = summaryInfo.getLineCount();
        int sectionCount = summaryInfo.getSectionCount();
        int slideCount = summaryInfo.getSlideCount();


//        enter code here
        System.out.println("---------------------------");
        System.out.println("Category: " + category);
        System.out.println("Company: " + company);
        System.out.println("Line Count: " + lineCount);
        System.out.println("Section Count: " + sectionCount);
        System.out.println("Slide Count: " + slideCount);

    }

}
