package com.joshua.data;

import org.apache.poi.hwpf.HWPFDocument;
import org.apache.poi.hwpf.converter.WordToHtmlConverter;
import org.apache.poi.hwpf.extractor.WordExtractor;

import javax.swing.*;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.*;

/**
 * Created by joshua on 2016/5/16.
 */
public class Converter {
    private File docFile;
    private File file;

    public Converter(File docFile) {
        this.docFile = docFile;
    }

    public void convert(File file) {
        this.file = file;

        try {
            FileInputStream finStream = new FileInputStream(docFile.getAbsolutePath());
            HWPFDocument doc = new HWPFDocument(finStream);
            WordExtractor wordExtract = new WordExtractor(doc);
            org.w3c.dom.Document newDocument = DocumentBuilderFactory.newInstance().newDocumentBuilder().newDocument();
            WordToHtmlConverter wordToHtmlConverter = new WordToHtmlConverter(newDocument);
            wordToHtmlConverter.processDocument(doc);

            StringWriter stringWriter = new StringWriter();
            Transformer transformer = TransformerFactory.newInstance()
                    .newTransformer();

            transformer.setOutputProperty(OutputKeys.INDENT, "yes");
            transformer.setOutputProperty(OutputKeys.ENCODING, "utf-8");
            transformer.setOutputProperty(OutputKeys.METHOD, "html");
            transformer.transform(

                    new DOMSource(wordToHtmlConverter.getDocument()),
                    new StreamResult(stringWriter));

            String html = stringWriter.toString();

            FileOutputStream fos;
            DataOutputStream dos;

            try {
                BufferedWriter out = new BufferedWriter
                        (new OutputStreamWriter(new FileOutputStream(file), "UTF-8"));

                out.write(html);
                out.close();
            } catch (IOException e) {
                e.printStackTrace();
            }


            JEditorPane editorPane = new JEditorPane();
            editorPane.setContentType("text/html");
            editorPane.setEditable(false);

            editorPane.setPage(file.toURI().toURL());

            JScrollPane scrollPane = new JScrollPane(editorPane);
            JFrame f = new JFrame("Display Html File");
            f.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            f.getContentPane().add(scrollPane);
            f.setSize(512, 342);
            f.setVisible(true);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}