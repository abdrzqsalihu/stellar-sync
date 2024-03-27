import * as React from "react";
import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

export const EmailTemplate = ({ response }) => (
  <div>
    <Html>
      <Head />
      <Preview>A file was shared with you</Preview>
      <Body style={main}>
        <Container>
          <Section style={logo}>{/* <Img src="/logo.png" /> */}</Section>
          <Section style={content}>
            <Row
              style={{
                paddingBottom: "0",
                paddingLeft: "12px",
                paddingRight: "12px",
              }}
            >
              <Column>
                <Heading
                  style={{
                    fontSize: 25,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Hi {response?.emailToSend?.split("@")[0]},
                </Heading>
                <Heading
                  as="h2"
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {response?.userName} shared a file with you
                </Heading>
                <br />
                <Text style={paragraph}>
                  <b>File Name: {response.fileName}</b>
                </Text>
                <Text style={{ marginTop: -5 }}>
                  <b>
                    File Size: {(response.fileSize / 1024 / 1024).toFixed(2)}MB
                  </b>
                </Text>
                <Text style={{ marginTop: -5 }}>
                  <b>File Type: {response.fileType}</b>
                </Text>
                <div style={{ textAlign: "center", marginTop: "12px" }}>
                  <Text
                    style={{
                      color: "rgb(0,0,0, 0.5)",
                      fontSize: 12,
                    }}
                  >
                    *Access and Download file on your own risk*
                  </Text>

                  <Text style={{ marginTop: "-8px", fontSize: "14" }}>
                    Click the button below to access your file
                  </Text>
                </div>
              </Column>
            </Row>
            <Row
              style={{
                width: "100%",
                paddingTop: "0",
                paddingBottom: "14px",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <Button style={button} href={response?.shortUrl}>
                  Click here to Download
                </Button>
              </div>
            </Row>

            {/* <a href={response?.shortUrl}>Click To Download</a> */}
          </Section>
          <Text
            style={{ fontSize: "14", marginBottom: "6px", textAlign: "center" }}
          >
            You can also share files with stellarsync
          </Text>
          <Text
            style={{
              textAlign: "center",
              fontSize: 12,
              color: "rgb(0,0,0, 0.7)",
            }}
          >
            © 2024 | StellarSync
          </Text>
        </Container>
      </Body>
    </Html>
  </div>
);

const main = {
  backgroundColor: "#fff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const paragraph = {
  fontSize: 16,
};

const containerButton = {
  display: "flex",
  justifyContent: "center",
  width: "100%",
};

const logo = {
  padding: "30px 20px",
};

const button = {
  backgroundColor: "#e00707",
  padding: "12px 30px",
  borderRadius: 3,
  color: "#FFF",
  fontWeight: "bold",
  border: "1px solid rgb(0,0,0, 0.1)",
  cursor: "pointer",
};

const content = {
  border: "1px solid rgb(0,0,0, 0.1)",
  borderRadius: "3px",
  overflow: "hidden",
};

const boxInfos = {
  margin: "auto",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
};

const containerImageFooter = {
  padding: "45px 0 0 0",
};
